import { NextRequest, NextResponse } from 'next/server'
import { pricingRequestSchema } from '@/lib/validations'

// Real distance calculation using Google Maps Distance Matrix API
const calculateDistance = async (pickup: string, dropoff: string): Promise<number | null> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.warn('Google Maps API key not available')
    return null
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(dropoff)}&units=imperial&key=${apiKey}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'OK' && data.rows[0]?.elements[0]?.distance) {
      // Convert meters to miles
      const distanceMeters = data.rows[0].elements[0].distance.value
      const distanceMiles = distanceMeters * 0.000621371 // meters to miles
      return Math.round(distanceMiles * 10) / 10 // Round to 1 decimal place
    } else {
      console.warn('Distance Matrix API returned invalid response:', data.status)
      return null
    }
  } catch (error) {
    console.error('Error calculating distance:', error)
    return null
  }
}

const calculatePrice = async (pickup: string, dropoff: string, passengers: number, rideType: string) => {
  // Base prices for different vehicle types ($5 base fare)
  const basePrices = {
    STANDARD: 500, // $5 base
    SUV: 500,      // $5 base
    LUXURY: 500    // $5 base
  }

  // Get real distance using Google Maps API
  const distanceMiles = await calculateDistance(pickup, dropoff)
  
  // Return null if distance calculation failed
  if (distanceMiles === null) {
    return null
  }
  
  const pricePerMile = 180 // $1.80 per mile (180 cents)

  // Calculate base price
  const basePrice = basePrices[rideType as keyof typeof basePrices] || basePrices.STANDARD
  
  // Add distance cost
  const distanceCost = Math.round(distanceMiles * pricePerMile)
  
  // Add passenger surcharge (after 2 passengers)
  const passengerSurcharge = Math.max(0, passengers - 2) * 500 // $5 per additional passenger
  
  const totalCents = basePrice + distanceCost + passengerSurcharge
  
  return {
    totalCents,
    breakdown: {
      basePrice,
      distanceCost,
      passengerSurcharge,
      distanceMiles
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = pricingRequestSchema.parse(body)
    
    const { pickup, dropoff, passengers, rideType = 'STANDARD' } = validatedData
    
    // Calculate price
    const pricing = await calculatePrice(pickup, dropoff, passengers, rideType)
    
    // Return error if pricing calculation failed
    if (pricing === null) {
      return NextResponse.json(
        { success: false, error: 'Unable to calculate distance and pricing' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        totalCents: pricing.totalCents,
        breakdown: pricing.breakdown,
        currency: 'USD'
      }
    })
    
  } catch (error) {
    console.error('Pricing estimation error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to calculate pricing' },
      { status: 500 }
    )
  }
}
