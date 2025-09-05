'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

interface AdminHeaderProps {
  username: string
}

export const AdminHeader = ({ username }: AdminHeaderProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      })
      
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back, {username}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {isLoggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </div>
    </header>
  )
}
