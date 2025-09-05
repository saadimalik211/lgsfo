import { Car } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-12 max-w-3xl mx-auto">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Book Your Ride
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Reliable transportation to and from SFO and Bay Area airports
              </p>
            </div>
            
            <div className="pt-8">
              <Link href="/book">
                <button className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-16 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  <Car className="mr-3 h-6 w-6" />
                  Schedule Ride
                </button>
              </Link>
            </div>

            {/* Subtle decorative elements */}
            <div className="flex justify-center space-x-4 pt-8">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
