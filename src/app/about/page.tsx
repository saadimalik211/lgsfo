import { Car, Shield, Clock, Phone, Mail, MapPin, CreditCard, Users, Star, FileText, Scale } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              About LETSGOSFO
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Your trusted premium ride booking platform for the Greater Bay Area
            </p>
          </div>
        </div>
      </section>

      {/* Business Description */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Premium Transportation Services
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                LETSGOSFO is a premium ride booking platform specializing in reliable transportation 
                across the Greater Bay Area, with a focus on Marin County to San Francisco International 
                Airport (SFO) routes. We provide safe, comfortable, and punctual transportation services 
                for individuals, families, and business travelers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our services include airport transfers, business travel, special events, and custom 
                transportation solutions. We use modern, well-maintained vehicles and professional 
                drivers to ensure your journey is comfortable and stress-free.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700 font-medium">Premium Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Safe & Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700 font-medium">On-Time</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Our Services</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Car className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Airport Transfers</h4>
                      <p className="text-gray-600">Reliable transportation to and from SFO and Bay Area airports</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Group Transportation</h4>
                      <p className="text-gray-600">Comfortable rides for families and business groups</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Scheduled Rides</h4>
                      <p className="text-gray-600">Book in advance for guaranteed availability</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Links */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Important Information
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/contact" className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-gray-600 text-sm">Get in touch with us for bookings and support</p>
                </div>
              </Link>
              
              <Link href="/policies" className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Policies & Terms</h3>
                  <p className="text-gray-600 text-sm">Cancellation, refund, and service policies</p>
                </div>
              </Link>
              
              <Link href="/security" className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Security & Payment</h3>
                  <p className="text-gray-600 text-sm">How we protect your data and process payments</p>
                </div>
              </Link>
              
              <Link href="/legal" className="group">
                <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <Scale className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Information</h3>
                  <p className="text-gray-600 text-sm">Insurance, accessibility, and legal compliance</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Book Your Ride?
            </h2>
            <p className="text-xl text-blue-100">
              Experience premium transportation with LETSGOSFO
            </p>
            <div className="pt-4">
              <Link href="/book">
                <button className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-blue-600 px-12 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  <Car className="mr-3 h-6 w-6" />
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
