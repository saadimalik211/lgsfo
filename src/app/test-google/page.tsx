'use client'

import { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    google: any
  }
}

export default function TestGooglePage() {
  const [googleLoaded, setGoogleLoaded] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if API key is available
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    setApiKey(key || 'NOT_FOUND')
    
    console.log('🔍 Testing Google Maps API...')
    console.log('🔑 API Key:', key ? 'FOUND' : 'NOT_FOUND')
    
    if (window.google) {
      console.log('✅ Google Maps already loaded')
      setGoogleLoaded(true)
      return
    }

    if (!key || key === 'your_google_maps_api_key') {
      console.warn('⚠️ Google Maps API key not configured')
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log('✅ Google Maps API loaded successfully')
      setGoogleLoaded(true)
    }
    script.onerror = () => {
      console.error('❌ Failed to load Google Maps API')
      setGoogleLoaded(false)
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!googleLoaded || !window.google || !inputRef.current) return

    console.log('🎯 Setting up test autocomplete...')
    
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      console.log('📍 Place selected:', place)
    })

    console.log('✅ Test autocomplete ready')
  }, [googleLoaded])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Google Maps API Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API Key Status:</label>
            <div className={`px-3 py-2 rounded ${apiKey !== 'NOT_FOUND' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {apiKey !== 'NOT_FOUND' ? '✅ Found' : '❌ Not Found'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Google Maps Status:</label>
            <div className={`px-3 py-2 rounded ${googleLoaded ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {googleLoaded ? '✅ Loaded' : '⏳ Loading...'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Test Address Input:</label>
            <input
              ref={inputRef}
              type="text"
              placeholder={googleLoaded ? "Start typing for suggestions..." : "Loading autocomplete..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-xs text-gray-600">
            <p>Open browser console (F12) to see detailed logs.</p>
            <p>Try typing an address to test autocomplete.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
