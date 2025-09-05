import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getAdminSession()
    
    if (session.isAuthenticated) {
      return NextResponse.json({ 
        authenticated: true, 
        username: session.username 
      })
    } else {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    )
  }
}
