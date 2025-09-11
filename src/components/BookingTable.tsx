'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, Search, Filter, Trash2 } from 'lucide-react'
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
  priceCents: number
  status: BookingStatus
  createdAt: string
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
    amountCents: number
    status: string
  }>
}

interface BookingTableProps {
  bookings: Booking[]
  onStatusChange: (bookingId: string, status: BookingStatus) => void
  onDelete: (bookingId: string) => void
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

export const BookingTable = ({ bookings, onStatusChange, onDelete }: BookingTableProps) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)

  const handleViewBooking = (bookingId: string) => {
    router.push(`/admin/bookings/${bookingId}`)
  }

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (bookingToDelete) {
      onDelete(bookingToDelete.id)
      setDeleteDialogOpen(false)
      setBookingToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setBookingToDelete(null)
  }

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.customerName || booking.user?.name || ''
    const customerEmail = booking.customerEmail || booking.user?.email || ''
    
    const matchesSearch = 
      booking.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {booking.customerName || booking.user?.name || 'Guest'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.customerEmail || booking.user?.email || 'N/A'}
                        </div>
                        {(booking.customerPhone || booking.user?.phone) && (
                          <div className="text-sm text-gray-500">
                            {booking.customerPhone || booking.user?.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.pickup}</div>
                        <div className="text-sm text-gray-500">→ {booking.dropoff}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {format(new Date(booking.datetime), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(booking.datetime), 'h:mm a')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{booking.passengers} passengers</div>
                        {booking.luggage > 0 && (
                          <div className="text-sm text-gray-500">{booking.luggage} luggage</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(booking.priceCents)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Select
                          value={booking.status}
                          onValueChange={(value) => onStatusChange(booking.id, value as BookingStatus)}
                        >
                          <SelectTrigger className="w-32 h-6 text-xs">
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewBooking(booking.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(booking)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
              {bookingToDelete && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="font-medium">
                    {bookingToDelete.customerName || bookingToDelete.user?.name || 'Guest'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {bookingToDelete.pickup} → {bookingToDelete.dropoff}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(bookingToDelete.datetime), 'MMM dd, yyyy h:mm a')}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(bookingToDelete.priceCents)}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
