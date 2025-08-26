import { NextRequest, NextResponse } from 'next/server'
import { bookingSchema } from '@/lib/validations'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = bookingSchema.parse(body)
    
    const {
      pickup,
      dropoff,
      datetime,
      passengers,
      luggage,
      extras,
      rideType,
      priceCents
    } = validatedData
    
    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        pickup,
        dropoff,
        datetime: new Date(datetime),
        passengers,
        luggage,
        extras: extras || [],
        rideType,
        priceCents,
        status: 'PENDING'
      }
    })
    
    return NextResponse.json({
      success: true,
      data: {
        bookingId: booking.id,
        status: booking.status
      }
    })
    
  } catch (error) {
    console.error('Booking creation error:', error)
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }
    
    // Get bookings with pagination
    const bookings = await prisma.booking.findMany({
      where,
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
            status: true,
            amountCents: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })
    
    // Get total count
    const total = await prisma.booking.count({ where })
    
    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    })
    
  } catch (error) {
    console.error('Booking fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
