'use client'

import { useState, useEffect } from 'react'
import { AdminHeader } from './AdminHeader'
import { BookingTable } from './BookingTable'
import { BookingDetail } from './BookingDetail'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

interface AdminDashboardProps {
  username: string
}

export const AdminDashboard = ({ username }: AdminDashboardProps) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/bookings')
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      setBookings(data.bookings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (bookingId: string, status: BookingStatus) => {
    try {
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

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status }
            : booking
        )
      )

      // Update selected booking if it's the one being changed
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status } : null)
      }
    } catch (err) {
      console.error('Error updating booking status:', err)
      // You could add a toast notification here
    }
  }

  const handleViewBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details')
      }
      
      const data = await response.json()
      setSelectedBooking(data.booking)
    } catch (err) {
      console.error('Error fetching booking details:', err)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Calculate dashboard stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
    totalRevenue: bookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.priceCents, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader username={username} />
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader username={username} />
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader username={username} />
      
      <div className="p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalRevenue)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <BookingTable
          bookings={bookings}
          onViewBooking={handleViewBooking}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
