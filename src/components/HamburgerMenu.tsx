'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Car, BookOpen, Info, Shield } from 'lucide-react'
import Link from 'next/link'

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleMenu = () => {
    if (!isOpen) {
      setIsOpen(true)
      // Small delay to ensure the element is rendered before animation
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setTimeout(() => setIsOpen(false), 300) // Match animation duration
    }
  }

  const closeMenu = () => {
    setIsAnimating(false)
    setTimeout(() => setIsOpen(false), 300) // Match animation duration
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const menuItems = [
    {
      href: '/book',
      label: 'Book Ride',
      icon: BookOpen
    },
    {
      href: '/about',
      label: 'About Us',
      icon: Info
    },
    {
      href: '/admin/login',
      label: 'Driver Portal',
      icon: Shield
    }
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex items-center space-x-1">
        {menuItems.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          onClick={closeMenu}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Menu Panel */}
          <div
            className={`absolute left-0 top-20 w-96 max-w-[90vw] bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
              isAnimating ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'white', height: 'calc(100vh - 5rem)' }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-end p-6 border-b border-gray-200 bg-gray-50" style={{ backgroundColor: '#f9fafb' }}>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-6 bg-white" style={{ backgroundColor: 'white' }}>
              <nav className="space-y-3">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                    >
                      <Icon className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <span className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-gray-50" style={{ backgroundColor: '#f9fafb' }}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Premium transportation services
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="tel:+16075426874"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    (607) 542-6874
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="mailto:saadmali@gensosekai.com"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HamburgerMenu
