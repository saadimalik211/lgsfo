'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, MapPin, Calendar, Users, Car, Download } from 'lucide-react'
import Link from 'next/link'

interface BookingDetails {
  id: string
  pickup: string
  dropoff: string
  datetime: string
  passengers: number
  luggage: number
  rideType: string
  priceCents: number
  status: string
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const sessionId = searchParams.get('session_id')
  const paymentMethod = searchParams.get('payment_method')
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId)
    }
  }, [bookingId])

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setBooking(data.data)
      }
    } catch (error) {
      console.error('Error fetching booking details:', error)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Booking Not Found</CardTitle>
            <CardDescription>
              We couldn&apos;t find the booking details. Please contact support if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
          <p className="text-slate-600">Your ride has been successfully booked and confirmed.</p>
        </div>

        {/* Booking Details */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Ride Details
            </CardTitle>
            <CardDescription>
              Booking ID: {booking.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Pickup</p>
                  <p className="text-slate-600">{booking.pickup}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Dropoff</p>
                  <p className="text-slate-600">{booking.dropoff}</p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-slate-900">Date & Time</p>
                  <p className="text-slate-600">
                    {new Date(booking.datetime).toLocaleDateString()}
                  </p>
                  <p className="text-slate-600">
                    {new Date(booking.datetime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-slate-900">Passengers</p>
                  <p className="text-slate-600">{booking.passengers}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-medium text-slate-900">Vehicle</p>
                  <p className="text-slate-600">{booking.rideType}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-slate-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(booking.priceCents)}
              </span>
            </div>
            {paymentMethod === 'cash' ? (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 font-bold text-lg">💰</span>
                  <span className="font-medium text-green-800">Pay on Arrival</span>
                </div>
                <p className="text-sm text-green-700">
                  You'll pay your driver directly with cash, Venmo, Zelle, or your preferred method.
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500 mt-2">
                Payment authorized via Stripe • Will be charged after ride completion
              </p>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle>What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-slate-900">Confirmation Email</p>
                <p className="text-slate-600">You&apos;ll receive a detailed confirmation email shortly.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-slate-900">Driver Assignment</p>
                <p className="text-slate-600">Your driver will be assigned and you&apos;ll receive their details 30 minutes before pickup.</p>
              </div>
            </div>
            {paymentMethod === 'cash' && (
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  💰
                </div>
                <div>
                  <p className="font-medium text-slate-900">Payment on Arrival</p>
                  <p className="text-slate-600">Have your payment ready - cash, Venmo, Zelle, or your preferred method.</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                {paymentMethod === 'cash' ? '4' : '3'}
              </div>
              <div>
                <p className="font-medium text-slate-900">Enjoy Your Ride</p>
                <p className="text-slate-600">Your driver will arrive at the scheduled time for a premium experience.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex items-center gap-2" variant="outline">
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
          <Link href="/" className="flex-1">
            <Button className="w-full">Return Home</Button>
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 p-4 bg-slate-50 rounded-lg">
          <p className="text-slate-600 mb-2">Need help? Contact our support team</p>
          <p className="text-sm text-slate-500">
            Email: support@letsgosfo.com • Phone: +1 (415) 555-0123
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
