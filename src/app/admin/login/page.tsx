'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLogin } from '@/components/AdminLogin'

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/check', {
          method: 'GET',
        })
        
        if (response.ok) {
          router.push('/admin')
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">LETSGOSFO</h1>
          <p className="text-gray-600 mt-2">Admin Portal</p>
        </div>
        
        <AdminLogin isOpen={true} onClose={() => {}} />
      </div>
    </div>
  )
}
