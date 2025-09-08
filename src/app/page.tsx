import { Car } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                  Book Your Ride
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Reliable transportation to and from Bay Area airports, SFO SJC OAK, and around the Greater Bay Area.
                </p>
              </div>
              
              <div className="pt-4">
                <Link href="/book">
                  <button className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-16 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                    <Car className="mr-3 h-6 w-6" />
                    Schedule Ride
                  </button>
                </Link>
              </div>

              {/* Subtle decorative elements */}
              <div className="flex justify-center lg:justify-start space-x-4 pt-6">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>

            {/* Right side - Tesla image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-4">
                  <Image
                    src="/tesla-model-y.jpg"
                    alt="Tesla Model Y - Premium ride service"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
