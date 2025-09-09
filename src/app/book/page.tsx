'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Users, Package, Car, Loader2, CreditCard, ArrowLeft, Clock, Navigation, Route, User, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface BookingData {
  pickup: string
  dropoff: string
  datetime: string
  passengers: number
  luggage: number
  extras: string[]
  rideType: 'STANDARD' | 'SUV' | 'LUXURY'
  customerName: string
  customerEmail: string
  customerPhone: string
}

interface PricingData {
  totalCents: number
  breakdown: {
    basePrice: number
    distanceCost: number
    passengerSurcharge: number
    distanceMiles: number
  }
  currency: string
}

declare global {
  interface Window {
    google: any
  }
}

export default function BookingPage() {
  const [bookingData, setBookingData] = useState<BookingData>({
    pickup: '',
    dropoff: '',
    datetime: '',
    passengers: 1,
    luggage: 0,
    extras: [],
    rideType: 'STANDARD',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  })
  
  const [priceEstimate, setPriceEstimate] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  const pickupInputRef = useRef<HTMLInputElement>(null)
  const dropoffInputRef = useRef<HTMLInputElement>(null)

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      console.log('🔍 Loading Google Maps API...')
      console.log('🔑 API Key available:', !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
      
      if (window.google) {
        console.log('✅ Google Maps already loaded')
        setGoogleLoaded(true)
        return
      }

      // Check if API key is available
      if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key') {
        console.warn('⚠️ Google Maps API key not configured. Address autocomplete will not work.')
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        console.log('✅ Google Maps API loaded successfully')
        setGoogleLoaded(true)
      }
      script.onerror = () => {
        console.error('❌ Failed to load Google Maps API')
        setGoogleLoaded(false)
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  // Initialize autocomplete when Google Maps loads
  useEffect(() => {
    if (!googleLoaded || !window.google) {
      console.log('⏳ Waiting for Google Maps to load...')
      return
    }

    console.log('🎯 Initializing autocomplete...')

    // Add CSS to ensure autocomplete dropdown is visible
    const style = document.createElement('style')
    style.textContent = `
      .pac-container {
        z-index: 9999 !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        border: 1px solid #e5e7eb !important;
      }
      .pac-item {
        padding: 12px 16px !important;
        border-bottom: 1px solid #f3f4f6 !important;
        cursor: pointer !important;
      }
      .pac-item:hover {
        background-color: #f9fafb !important;
      }
      .pac-item-query {
        font-size: 14px !important;
        color: #374151 !important;
      }
      .pac-matched {
        font-weight: 600 !important;
        color: #1f2937 !important;
      }
    `
    document.head.appendChild(style)

    // Initialize pickup autocomplete
    if (pickupInputRef.current) {
      console.log('📍 Setting up pickup autocomplete')
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'geometry']
      })

      pickupAutocomplete.addListener('place_changed', () => {
        const place = pickupAutocomplete.getPlace()
        console.log('📍 Pickup place selected:', place.formatted_address)
        if (place.formatted_address) {
          setBookingData(prev => ({ ...prev, pickup: place.formatted_address }))
        }
      })
    }

    // Initialize dropoff autocomplete
    if (dropoffInputRef.current) {
      console.log('🎯 Setting up dropoff autocomplete')
      const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'geometry']
      })

      dropoffAutocomplete.addListener('place_changed', () => {
        const place = dropoffAutocomplete.getPlace()
        console.log('🎯 Dropoff place selected:', place.formatted_address)
        if (place.formatted_address) {
          setBookingData(prev => ({ ...prev, dropoff: place.formatted_address }))
        }
      })
    }

    console.log('✅ Autocomplete initialized successfully')
  }, [googleLoaded])

  // Auto-calculate price when locations change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bookingData.pickup && bookingData.dropoff) {
        calculatePrice()
      }
    }, 1000) // Debounce for 1 second

    return () => clearTimeout(timer)
  }, [bookingData.pickup, bookingData.dropoff])

  const handleInputChange = (field: keyof BookingData, value: string | number | Date | null) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const calculatePrice = async () => {
    if (!bookingData.pickup || !bookingData.dropoff) return
    
    setIsCalculating(true)
    try {
      const response = await fetch('/api/pricing/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pickup: bookingData.pickup,
          dropoff: bookingData.dropoff,
          datetime: bookingData.datetime || new Date().toISOString(),
          passengers: bookingData.passengers,
          extras: bookingData.extras,
          rideType: bookingData.rideType
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setPriceEstimate(data.data)
      } else {
        console.error('Pricing error:', data.error)
      }
    } catch (error) {
      console.error('Pricing request error:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleBooking = async (paymentMethod: 'stripe' | 'cash') => {
    if (!priceEstimate) return

    setLoading(true)
    try {
      // Create booking
      const bookingPayload = {
        pickup: bookingData.pickup,
        dropoff: bookingData.dropoff,
        datetime: bookingData.datetime ? new Date(bookingData.datetime).toISOString() : '',
        passengers: bookingData.passengers,
        luggage: bookingData.luggage,
        extras: bookingData.extras,
        rideType: bookingData.rideType,
        priceCents: priceEstimate.totalCents,
        customerName: bookingData.customerName,
        customerEmail: bookingData.customerEmail,
        customerPhone: bookingData.customerPhone
      }
      
      console.log('📤 Sending booking payload:', bookingPayload)
      
      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingPayload),
      })

      const bookingResult = await bookingResponse.json()
      
      if (!bookingResult.success) {
        throw new Error(bookingResult.error)
      }

      const newBookingId = bookingResult.data.bookingId

      if (paymentMethod === 'stripe') {
        // Create checkout session for Stripe
        const checkoutResponse = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: newBookingId,
            customerEmail: bookingData.customerEmail,
            customerName: bookingData.customerName
          }),
        })

        const checkoutData = await checkoutResponse.json()
        
        if (checkoutData.success && checkoutData.data.url) {
          // Redirect to Stripe Checkout
          window.location.href = checkoutData.data.url
        } else {
          throw new Error(checkoutData.error)
        }
      } else {
        // Handle cash/on-arrival payment
        const cashResponse = await fetch('/api/bookings/cash-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: newBookingId,
            customerEmail: bookingData.customerEmail,
            customerName: bookingData.customerName
          }),
        })

        const cashData = await cashResponse.json()
        
        if (cashData.success) {
          // Redirect to confirmation page
          window.location.href = `/confirm?bookingId=${newBookingId}&payment_method=cash`
        } else {
          throw new Error(cashData.error)
        }
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to process booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }

  const canProceedToStep2 = () => {
    return bookingData.pickup && bookingData.dropoff && priceEstimate
  }

  const canProceedToStep3 = () => {
    return bookingData.customerName && bookingData.customerEmail && bookingData.datetime
  }

  const isFormValid = () => {
    return bookingData.pickup && 
           bookingData.dropoff && 
           bookingData.datetime && 
           bookingData.passengers &&
           bookingData.customerName &&
           bookingData.customerEmail &&
           priceEstimate
  }


  const renderStep1 = () => (
    <div className="pt-8 pb-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Where to?</h1>
          <p className="text-gray-600">Enter your pickup and dropoff locations</p>
        </div>

        <div className="space-y-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <div className="relative">
              <Input
                ref={pickupInputRef}
                placeholder={googleLoaded ? "Start typing for suggestions..." : "Enter pickup address"}
                value={bookingData.pickup}
                onChange={(e) => handleInputChange('pickup', e.target.value)}
                className="w-full px-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dropoff Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dropoff Location
            </label>
            <div className="relative">
              <Input
                ref={dropoffInputRef}
                placeholder={googleLoaded ? "Start typing for suggestions..." : "Enter dropoff address"}
                value={bookingData.dropoff}
                onChange={(e) => handleInputChange('dropoff', e.target.value)}
                className="w-full px-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Price Display */}
          {isCalculating && (
            <div className="text-center py-6">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-blue-600" />
              <p className="text-gray-600 font-medium">Calculating fare...</p>
            </div>
          )}

          {priceEstimate && !isCalculating && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Estimated Fare</h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <Route className="h-4 w-4 mr-1" />
                    <span>{priceEstimate.breakdown.distanceMiles} miles</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(priceEstimate.totalCents)}
                  </div>
                  <div className="text-sm text-gray-600">estimated</div>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button 
            onClick={() => setCurrentStep(2)}
            disabled={!canProceedToStep2()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="pt-8 pb-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trip Details</h1>
          <p className="text-gray-600">Tell us about your trip</p>
        </div>

        <div className="space-y-6">
          {/* Trip Summary - Compact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Trip Summary</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>From:</span>
                <span className="font-medium truncate ml-2">{bookingData.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-medium truncate ml-2">{bookingData.dropoff}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-medium">{priceEstimate?.breakdown.distanceMiles} miles</span>
              </div>
              <div className="flex justify-between">
                <span>Fare:</span>
                <span className="font-medium text-blue-600">{priceEstimate ? formatCurrency(priceEstimate.totalCents) : 'Calculating...'}</span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <div className="relative">
              <Input
                type="datetime-local"
                value={bookingData.datetime}
                onChange={(e) => handleInputChange('datetime', e.target.value)}
                className="w-full px-4 py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Passengers, Luggage & Vehicle */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passengers
              </label>
              <Select value={bookingData.passengers.toString()} onValueChange={(value) => handleInputChange('passengers', parseInt(value))}>
                <SelectTrigger className="w-full py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Luggage
              </label>
              <Select value={bookingData.luggage.toString()} onValueChange={(value) => handleInputChange('luggage', parseInt(value))}>
                <SelectTrigger className="w-full py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <Select value={bookingData.rideType} onValueChange={(value: 'STANDARD' | 'SUV' | 'LUXURY') => handleInputChange('rideType', value)}>
                <SelectTrigger className="w-full py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="LUXURY">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Contact Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                placeholder="Enter your full name"
                value={bookingData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={bookingData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className="w-full py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={bookingData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className="w-full py-3 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="flex-1 py-3"
            >
              Back
            </Button>
            <Button 
              onClick={() => setCurrentStep(3)}
              disabled={!canProceedToStep3()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="pt-8 pb-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Booking</h1>
          <p className="text-gray-600">Please review your booking details</p>
        </div>

        <div className="space-y-6">
          {/* Trip Summary - Compact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Trip Summary</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>From:</span>
                <span className="font-medium truncate ml-2">{bookingData.pickup}</span>
              </div>
              <div className="flex justify-between">
                <span>To:</span>
                <span className="font-medium truncate ml-2">{bookingData.dropoff}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{bookingData.datetime ? new Date(bookingData.datetime).toLocaleDateString() : 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{bookingData.datetime ? new Date(bookingData.datetime).toLocaleTimeString() : 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span>Passengers:</span>
                <span className="font-medium">{bookingData.passengers}</span>
              </div>
              <div className="flex justify-between">
                <span>Vehicle:</span>
                <span className="font-medium">{bookingData.rideType.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Contact Summary - Compact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Contact</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{bookingData.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-medium truncate ml-2">{bookingData.customerEmail}</span>
              </div>
              {bookingData.customerPhone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-medium">{bookingData.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          {priceEstimate && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-900">Total Fare:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(priceEstimate.totalCents)}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Base fare:</span>
                  <span className="font-medium">{formatCurrency(priceEstimate.breakdown.basePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance ({priceEstimate.breakdown.distanceMiles} mi):</span>
                  <span className="font-medium">{formatCurrency(priceEstimate.breakdown.distanceCost)}</span>
                </div>
                {priceEstimate.breakdown.passengerSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span>Passenger surcharge:</span>
                    <span className="font-medium">{formatCurrency(priceEstimate.breakdown.passengerSurcharge)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <Button 
            onClick={() => setCurrentStep(4)}
            disabled={!isFormValid()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            Continue to Payment
          </Button>

          {/* Back Button */}
          <Button 
            onClick={() => setCurrentStep(2)}
            variant="outline"
            className="w-full py-3"
          >
            Back to Details
          </Button>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="pt-8 pb-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Payment</h1>
          <p className="text-gray-600">Select your preferred payment method</p>
        </div>

        <div className="space-y-6">
          {/* Price Summary */}
          {priceEstimate && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total Fare:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(priceEstimate.totalCents)}
                </span>
              </div>
            </div>
          )}

          {/* Payment Options */}
          <div className="space-y-4">
            {/* Stripe Payment Option */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Pay with Card</h3>
                    <p className="text-sm text-gray-600">Secure payment with authorization hold</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Visa, Mastercard, Amex</div>
                  <div className="text-xs text-gray-500">Charged after ride</div>
                </div>
              </div>
              <Button 
                onClick={() => handleBooking('stripe')}
                disabled={!isFormValid() || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay with Card
                  </>
                )}
              </Button>
            </div>

            {/* Cash Payment Option */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">$</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Pay on Arrival</h3>
                    <p className="text-sm text-gray-600">Cash, Venmo, Zelle, or other methods</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Flexible</div>
                  <div className="text-xs text-gray-500">No upfront charge</div>
                </div>
              </div>
              <Button 
                onClick={() => handleBooking('cash')}
                disabled={!isFormValid() || loading}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50 py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💰</span>
                    Pay on Arrival
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 mt-0.5 text-blue-600" />
                <div>
                  <p className="font-medium">Card Payment:</p>
                  <p>Your card will be authorized but not charged until after your ride is completed.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold text-sm mt-0.5">$</span>
                <div>
                  <p className="font-medium">Pay on Arrival:</p>
                  <p>Pay your driver directly with cash, Venmo, Zelle, or other preferred method.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <Button 
            onClick={() => setCurrentStep(3)}
            variant="outline"
            className="w-full py-3"
          >
            Back to Review
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </div>
  )
}
