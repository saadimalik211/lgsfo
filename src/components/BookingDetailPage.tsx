'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AdminHeader } from './AdminHeader'
import { ArrowLeft, MapPin, Calendar, Users, CreditCard, Phone, Mail, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { BookingStatus } from '@prisma/client'

interface Booking {
  id: string
  pickup: string
  dropoff: string
  datetime: string
  passengers: number
  luggage: number
  rideType: string
  distanceKm: number | null
  durationMin: number | null
  priceCents: number
  status: BookingStatus
  createdAt: string
  updatedAt: string
  // Customer information stored directly on booking
  customerName: string | null
  customerEmail: string | null
  customerPhone: string | null
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
  payments: Array<{
    id: string
    stripePaymentId: string | null
    stripePaymentIntentId: string | null
    amountCents: number
    currency: string
    status: string
    createdAt: string
    updatedAt: string
  }>
}

interface BookingDetailPageProps {
  bookingId: string
  username: string
}

const getStatusBadgeVariant = (status: BookingStatus) => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'CONFIRMED':
      return 'success'
    case 'COMPLETED':
      return 'default'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getPaymentStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'AUTHORIZED':
      return 'default'
    case 'SUCCEEDED':
      return 'success'
    case 'FAILED':
      return 'destructive'
    case 'CANCELLED':
      return 'secondary'
    case 'REQUIRES_PAYMENT_METHOD':
      return 'warning'
    case 'REFUNDED':
      return 'outline'
    default:
      return 'outline'
  }
}

export const BookingDetailPage = ({ bookingId, username }: BookingDetailPageProps) => {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState('')

  const fetchBooking = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/bookings/${bookingId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Booking not found')
        } else {
          throw new Error('Failed to fetch booking details')
        }
        return
      }
      
      const data = await response.json()
      setBooking(data.booking)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (status: BookingStatus) => {
    if (!booking) return

    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }

      const data = await response.json()
      setBooking(data.booking)
    } catch (err) {
      console.error('Error updating booking status:', err)
      // You could add a toast notification here
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCapturePayment = async () => {
    if (!booking) return

    try {
      setIsCapturing(true)
      const response = await fetch(`/api/admin/bookings/${bookingId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to capture payment')
      }

      const data = await response.json()
      
      // Refresh booking data to show updated payment status
      await fetchBooking()
      
      // You could add a success toast notification here
      console.log('Payment captured successfully:', data)
      
    } catch (err) {
      console.error('Error capturing payment:', err)
      setError(err instanceof Error ? err.message : 'Failed to capture payment')
      // You could add an error toast notification here
    } finally {
      setIsCapturing(false)
    }
  }

  const handleBackToDashboard = () => {
    router.push('/admin')
  }

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader username={username} />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader username={username} />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Booking</h2>
            <p className="text-gray-600 mb-4">{error || 'Booking not found'}</p>
            <Button onClick={fetchBooking}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={username} />
      
      <div className="p-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-gray-600">Booking ID: {booking.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Pickup Location</label>
                <p className="text-lg">{booking.pickup}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Dropoff Location</label>
                <p className="text-lg">{booking.dropoff}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date & Time</label>
                <p className="text-lg">
                  {format(new Date(booking.datetime), 'EEEE, MMMM dd, yyyy')}
                </p>
                <p className="text-gray-600">
                  {format(new Date(booking.datetime), 'h:mm a')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Passengers</label>
                  <p className="text-lg">{booking.passengers}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Luggage</label>
                  <p className="text-lg">{booking.luggage}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ride Type</label>
                <p className="text-lg capitalize">{booking.rideType.toLowerCase()}</p>
              </div>
              {booking.distanceKm && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Distance</label>
                  <p className="text-lg">{booking.distanceKm.toFixed(1)} km</p>
                </div>
              )}
              {booking.durationMin && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Estimated Duration</label>
                  <p className="text-lg">{booking.durationMin} minutes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Display customer information from booking fields first, fallback to user relation */}
              {(booking.customerName || booking.customerEmail) ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg">{booking.customerName || booking.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {booking.customerEmail || booking.user?.email || 'N/A'}
                    </p>
                  </div>
                  {(booking.customerPhone || booking.user?.phone) && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-lg flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {booking.customerPhone || booking.user?.phone || 'N/A'}
                      </p>
                    </div>
                  )}
                </>
              ) : booking.user ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-lg">{booking.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {booking.user.email}
                    </p>
                  </div>
                  {booking.user.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-lg flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {booking.user.phone}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-500">No customer information available</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Total Amount</label>
                <p className="text-2xl font-bold">{formatCurrency(booking.priceCents)}</p>
              </div>
              {booking.payments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Payment Status</label>
                  <div className="space-y-2">
                    {booking.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{formatCurrency(payment.amountCents)}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(payment.createdAt), 'MMM dd, yyyy h:mm a')}
                          </p>
                          {payment.stripePaymentIntentId && (
                            <p className="text-xs text-gray-400">
                              Payment Intent: {payment.stripePaymentIntentId.slice(-8)}
                            </p>
                          )}
                        </div>
                        <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  {booking.payments.some(p => p.status === 'AUTHORIZED') && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-800 font-medium">
                            💳 Payment is authorized and ready to capture
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Click the button below to capture the payment
                          </p>
                        </div>
                        <Button
                          onClick={handleCapturePayment}
                          disabled={isCapturing}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isCapturing ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Capturing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Capture Payment
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  {booking.payments.some(p => p.status === 'SUCCEEDED') && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        ✅ Payment has been successfully captured
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Current Status</label>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={getStatusBadgeVariant(booking.status)} className="text-sm">
                    {booking.status}
                  </Badge>
                  <Select
                    value={booking.status}
                    onValueChange={handleStatusChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created</label>
                <p className="text-lg">
                  {format(new Date(booking.createdAt), 'MMM dd, yyyy h:mm a')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-lg">
                  {format(new Date(booking.updatedAt), 'MMM dd, yyyy h:mm a')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
