import { Car } from "lucide-react"
import Link from "next/link"
import HamburgerMenu from "./HamburgerMenu"

export default function GlobalBanner() {
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50 relative">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <HamburgerMenu />
          
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Car className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-blue-600">
              LETSGOSFO
            </span>
          </Link>
          
          {/* Spacer to balance the layout */}
          <div className="w-10 h-10"></div>
        </div>
      </div>
    </nav>
  )
}
