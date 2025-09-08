import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'
import { BookingStatus } from '@prisma/client'
import Stripe from 'stripe'

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil'
}) : null

const updateSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAdminAuth()
    
    const { id } = await params
    const booking = await db.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true
          }
        },
        payments: {
          select: {
            id: true,
            stripePaymentId: true,
            amountCents: true,
            currency: true,
            status: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Admin booking fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    const session = await requireAdminAuth()
    
    const body = await request.json()
    const updateData = updateSchema.parse(body)
    
    const { id } = await params
    
    // Check if booking exists and get payment info
    const existingBooking = await db.booking.findUnique({
      where: { id },
      include: {
        payments: true
      }
    })
    
    if (!existingBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Handle payment capture when marking as completed
    if (updateData.status === 'COMPLETED' && stripe) {
      const authorizedPayment = existingBooking.payments.find(
        payment => payment.status === 'AUTHORIZED' && payment.stripePaymentIntentId
      )
      
      if (authorizedPayment && authorizedPayment.stripePaymentIntentId) {
        try {
          // Capture the authorized payment
          await stripe.paymentIntents.capture(authorizedPayment.stripePaymentIntentId)
          console.log(`Payment captured for booking ${id}: ${authorizedPayment.stripePaymentIntentId}`)
        } catch (stripeError) {
          console.error('Failed to capture payment:', stripeError)
          return NextResponse.json(
            { error: 'Failed to capture payment. Please try again.' },
            { status: 500 }
          )
        }
      }
    }
    
    // Update booking
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        payments: {
          select: {
            id: true,
            stripePaymentId: true,
            stripePaymentIntentId: true,
            amountCents: true,
            currency: true,
            status: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })
    
    // Log admin action (you could add this to a separate audit log table)
    console.log(`Admin ${session.username} updated booking ${id}:`, updateData)
    
    return NextResponse.json({ booking: updatedBooking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }
    
    console.error('Admin booking update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
