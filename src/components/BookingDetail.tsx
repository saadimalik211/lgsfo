'use client'

import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, MapPin, Calendar, Users, CreditCard, Phone, Mail } from 'lucide-react'
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
  user: {
    id: string
    name: string
    email: string
    phone: string | null
  } | null
  payments: Array<{
    id: string
    stripePaymentId: string | null
    amountCents: number
    currency: string
    status: string
    createdAt: string
    updatedAt: string
  }>
}

interface BookingDetailProps {
  booking: Booking
  onClose: () => void
  onStatusChange: (bookingId: string, status: BookingStatus) => void
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
    case 'SUCCEEDED':
      return 'success'
    case 'FAILED':
      return 'destructive'
    case 'REQUIRES_PAYMENT_METHOD':
      return 'warning'
    case 'REFUNDED':
      return 'outline'
    default:
      return 'outline'
  }
}

export const BookingDetail = ({ booking, onClose, onStatusChange }: BookingDetailProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Booking Details</h2>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
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
                {booking.user ? (
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
                  <p className="text-gray-500">Guest booking</p>
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
                          </div>
                          <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
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
                      onValueChange={(value) => onStatusChange(booking.id, value as BookingStatus)}
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
    </div>
  )
}
