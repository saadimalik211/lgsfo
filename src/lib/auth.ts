import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface AdminSession {
  isAuthenticated: boolean
  username?: string
}

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123'
}

export const SESSION_COOKIE_NAME = 'admin-session'
export const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export const createAdminSession = (username: string): string => {
  const sessionData = {
    username,
    expires: Date.now() + SESSION_DURATION
  }
  return Buffer.from(JSON.stringify(sessionData)).toString('base64')
}

export const verifyAdminSession = (sessionToken: string): AdminSession => {
  try {
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    
    if (sessionData.expires < Date.now()) {
      return { isAuthenticated: false }
    }
    
    return {
      isAuthenticated: true,
      username: sessionData.username
    }
  } catch {
    return { isAuthenticated: false }
  }
}

export const getAdminSession = async (): Promise<AdminSession> => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!sessionToken) {
    return { isAuthenticated: false }
  }
  
  return verifyAdminSession(sessionToken)
}

export const requireAdminAuth = async (): Promise<AdminSession> => {
  const session = await getAdminSession()
  
  if (!session.isAuthenticated) {
    redirect('/admin/login')
  }
  
  return session
}

export const setAdminSessionCookie = async (sessionToken: string) => {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000
  })
}

export const clearAdminSessionCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}
