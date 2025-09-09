import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, customerEmail, customerName } = body
    
    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    // Get booking details
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true }
    })
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check if payment already exists
    if (booking.payments.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Payment already exists for this booking' },
        { status: 400 }
      )
    }
    
    // Create cash payment record
    await prisma.payment.create({
      data: {
        bookingId: bookingId,
        stripePaymentId: null, // No Stripe payment for cash
        stripePaymentIntentId: null,
        amountCents: booking.priceCents,
        currency: 'USD',
        status: 'REQUIRES_PAYMENT_METHOD', // Will be updated to SUCCEEDED when payment is collected
        paymentMethod: 'CASH'
      }
    })
    
    // Update booking status to confirmed for cash payments
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        bookingId: bookingId,
        paymentMethod: 'cash',
        status: 'confirmed'
      }
    })
    
  } catch (error) {
    console.error('Cash payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process cash payment booking' },
      { status: 500 }
    )
  }
}
