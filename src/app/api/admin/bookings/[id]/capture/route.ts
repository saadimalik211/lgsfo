import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { requireAdminAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil'
}) : null

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminAuth()
    
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }
    
    const { id } = await params
    
    // Get booking with payment information
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payments: true
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Find authorized payment
    const authorizedPayment = booking.payments.find(
      payment => payment.status === 'AUTHORIZED' && payment.stripePaymentIntentId
    )
    
    if (!authorizedPayment) {
      return NextResponse.json(
        { error: 'No authorized payment found for this booking' },
        { status: 400 }
      )
    }
    
    if (!authorizedPayment.stripePaymentIntentId) {
      return NextResponse.json(
        { error: 'No payment intent ID found' },
        { status: 400 }
      )
    }
    
    try {
      // Capture the authorized payment
      const capturedPayment = await stripe.paymentIntents.capture(
        authorizedPayment.stripePaymentIntentId
      )
      
      console.log(`Payment captured for booking ${id}: ${authorizedPayment.stripePaymentIntentId}`)
      
      // Update payment status in database
      await prisma.payment.update({
        where: { id: authorizedPayment.id },
        data: {
          status: 'SUCCEEDED'
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Payment captured successfully',
        paymentIntent: {
          id: capturedPayment.id,
          status: capturedPayment.status,
          amount: capturedPayment.amount
        }
      })
      
    } catch (stripeError: any) {
      console.error('Failed to capture payment:', stripeError)
      
      // Update payment status to failed if capture failed
      await prisma.payment.update({
        where: { id: authorizedPayment.id },
        data: {
          status: 'FAILED'
        }
      })
      
      return NextResponse.json(
        { 
          error: 'Failed to capture payment',
          details: stripeError.message || 'Unknown error'
        },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('Capture payment error:', error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
