import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        payments: {
          select: {
            id: true,
            status: true,
            amountCents: true,
            currency: true,
            createdAt: true
          }
        }
      }
    })
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: booking
    })
    
  } catch (error) {
    console.error('Booking fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { status } = body
    
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }
    
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        payments: {
          select: {
            id: true,
            status: true,
            amountCents: true,
            currency: true,
            createdAt: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      data: booking
    })
    
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}
