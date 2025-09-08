import { Phone, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Contact Information
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Get in touch with LETSGOSFO for all your transportation needs
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Phone className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Phone</h3>
                <p className="text-xl text-gray-600 mb-2">(607) 542-6874</p>
                <p className="text-sm text-gray-500">Available 24/7 for bookings</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Email</h3>
                <p className="text-xl text-gray-600 mb-2">saadmali@gensosekai.com</p>
                <p className="text-sm text-gray-500">Response within 1 day</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Business Address</h3>
                <p className="text-lg text-gray-600">
                  1746 Carpentier Street<br />
                  San Leandro, CA 94577
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Business Hours</h3>
              </div>
              <div className="space-y-3 text-lg text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">6:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">7:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">8:00 AM - 8:00 PM</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Emergency bookings available 24/7 by phone
                  </p>
                </div>
              </div>
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
              Contact us today or book online for immediate service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/book">
                <button className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Book Online
                </button>
              </Link>
              <a href="tel:+16075426874">
                <button className="inline-flex items-center justify-center bg-transparent border-2 border-white hover:bg-white text-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  <Phone className="mr-3 h-5 w-5" />
                  Call Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
