import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

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
    
    // Create Stripe checkout session with manual capture
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `LETSGOSFO Ride - ${booking.pickup} to ${booking.dropoff}`,
              description: `Premium ride service on ${new Date(booking.datetime).toLocaleDateString()} at ${new Date(booking.datetime).toLocaleTimeString()}. Payment will be processed after ride completion.`,
            },
            unit_amount: booking.priceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual', // This creates an authorization hold instead of immediate charge
        statement_descriptor_suffix: 'LETSGOSFO',
        metadata: {
          bookingId: bookingId,
          pickup: booking.pickup,
          dropoff: booking.dropoff,
          datetime: booking.datetime.toISOString(),
          passengers: booking.passengers.toString(),
          rideType: booking.rideType,
          customerEmail: customerEmail || '',
          customerName: customerName || ''
        }
      },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/confirm?bookingId=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/book`,
      customer_email: customerEmail,
      metadata: {
        bookingId: bookingId
      }
    })
    
    // Create payment record with session ID (we'll get the Payment Intent ID from webhook)
    await prisma.payment.create({
      data: {
        bookingId: bookingId,
        stripePaymentId: session.id,
        amountCents: booking.priceCents,
        currency: 'USD',
        status: 'REQUIRES_PAYMENT_METHOD'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    })
    
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create payment authorization' },
      { status: 500 }
    )
  }
}