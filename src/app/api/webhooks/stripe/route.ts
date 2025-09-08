import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil'
}) : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    if (!stripe || !webhookSecret) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId
  const paymentIntentId = session.payment_intent as string
  
  if (!bookingId) {
    console.error('No booking ID in session metadata')
    return
  }

  if (!paymentIntentId) {
    console.error('No payment intent ID in session')
    return
  }

  try {
    // Update payment record with Payment Intent ID and set status to AUTHORIZED
    await prisma.payment.updateMany({
      where: {
        bookingId: bookingId,
        stripePaymentId: session.id
      },
      data: {
        stripePaymentIntentId: paymentIntentId,
        status: 'AUTHORIZED'
      }
    })

    // Update booking status and customer information from Stripe session
    const updateData: any = { status: 'CONFIRMED' }
    
    // If customer information is missing from booking, try to get it from Stripe session
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { customerName: true, customerEmail: true, customerPhone: true }
    })
    
    if (existingBooking && (!existingBooking.customerName || !existingBooking.customerEmail)) {
      // Get customer details from Stripe session
      const customerEmail = session.customer_email || session.customer_details?.email
      const customerName = session.customer_details?.name
      
      if (customerEmail && !existingBooking.customerEmail) {
        updateData.customerEmail = customerEmail
      }
      if (customerName && !existingBooking.customerName) {
        updateData.customerName = customerName
      }
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    })

    console.log(`Payment authorized for booking ${bookingId}`)
    
    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata')
    return
  }

  try {
    // Update payment status to SUCCEEDED (this happens when we capture the payment)
    await prisma.payment.updateMany({
      where: {
        bookingId: bookingId,
        stripePaymentIntentId: paymentIntent.id
      },
      data: {
        status: 'SUCCEEDED'
      }
    })

    console.log(`Payment captured for booking ${bookingId}`)
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata')
    return
  }

  try {
    // Update payment status to FAILED
    await prisma.payment.updateMany({
      where: {
        bookingId: bookingId,
        stripePaymentIntentId: paymentIntent.id
      },
      data: {
        status: 'FAILED'
      }
    })

    console.log(`Payment failed for booking ${bookingId}`)
    
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata')
    return
  }

  console.log(`Payment requires action for booking ${bookingId}:`, paymentIntent.id)
  // This typically happens for 3D Secure authentication
  // The customer needs to complete additional authentication
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId
  
  if (!bookingId) {
    console.error('No booking ID in payment intent metadata')
    return
  }

  try {
    // Update payment status to CANCELLED
    await prisma.payment.updateMany({
      where: {
        bookingId: bookingId,
        stripePaymentIntentId: paymentIntent.id
      },
      data: {
        status: 'CANCELLED'
      }
    })

    console.log(`Payment cancelled for booking ${bookingId}`)
    
  } catch (error) {
    console.error('Error handling payment intent cancelled:', error)
  }
}