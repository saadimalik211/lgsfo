import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
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
  
  if (!bookingId) {
    console.error('No booking ID in session metadata')
    return
  }

  try {
    // Update payment status
    await prisma.payment.updateMany({
      where: {
        bookingId: bookingId,
        stripePaymentId: session.id
      },
      data: {
        status: 'SUCCEEDED'
      }
    })

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' }
    })

    console.log(`Payment completed for booking ${bookingId}`)
    
    // TODO: Send confirmation email to customer
    // TODO: Send notification to admin
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Handle Payment Intent success if using Payment Intents instead of Checkout
  console.log('Payment Intent succeeded:', paymentIntent.id)
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Handle Payment Intent failure
  console.log('Payment Intent failed:', paymentIntent.id)
}
