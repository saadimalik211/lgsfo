import { NextRequest, NextResponse } from 'next/server'
import { pricingRequestSchema } from '@/lib/validations'

// Real distance calculation using Google Maps Distance Matrix API
const calculateDistance = async (pickup: string, dropoff: string): Promise<number> => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.warn('Google Maps API key not available, using fallback distance')
    return 25 // fallback
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
      return 25 // fallback
    }
  } catch (error) {
    console.error('Error calculating distance:', error)
    return 25 // fallback
  }
}

const calculatePrice = async (pickup: string, dropoff: string, passengers: number, rideType: string) => {
  // Base prices for different vehicle types
  const basePrices = {
    STANDARD: 2500, // $25 base
    SUV: 3500,      // $35 base
    LUXURY: 5000    // $50 base
  }

  // Get real distance using Google Maps API
  const distanceMiles = await calculateDistance(pickup, dropoff)
  const pricePerMile = 240 // $2.40 per mile

  // Calculate base price
  let basePrice = basePrices[rideType as keyof typeof basePrices] || basePrices.STANDARD
  
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
