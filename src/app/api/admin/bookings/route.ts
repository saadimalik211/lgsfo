import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { BookingStatus } from '@prisma/client'

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.nativeEnum(BookingStatus).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  dateFrom: z.string().optional().or(z.literal('')),
  dateTo: z.string().optional().or(z.literal(''))
})

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getAdminSession()
    if (!session.isAuthenticated) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Simple query without complex filtering for now
    const bookings = await db.booking.findMany({
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
            amountCents: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    
    const total = await db.booking.count()
    
    return NextResponse.json({
      bookings,
      pagination: {
        page: 1,
        limit: 20,
        total,
        pages: Math.ceil(total / 20)
      }
    })
  } catch (error) {
    console.error('Admin bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
