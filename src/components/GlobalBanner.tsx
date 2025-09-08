import { Car } from "lucide-react"
import Link from "next/link"

export default function GlobalBanner() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              LETSGOSFO
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              About
            </Link>
            <Link href="/book" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
              Book Ride
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
