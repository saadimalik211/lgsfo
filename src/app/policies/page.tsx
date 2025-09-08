import { Clock, RefreshCw, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function Policies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Policies & Terms
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Important information about our service policies and terms
            </p>
          </div>
        </div>
      </section>

      {/* Policies Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Cancellation Policy */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Clock className="h-8 w-8 text-red-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Cancellation Policy</h3>
                </div>
                <div className="space-y-4 text-gray-600">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p><strong className="text-green-800">Free Cancellation:</strong> Cancel up to 2 hours before your scheduled pickup time for a full refund.</p>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p><strong className="text-yellow-800">Late Cancellation:</strong> Cancellations within 2 hours of pickup time will incur a 50% charge.</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p><strong className="text-red-800">No-Show:</strong> Failure to appear at the scheduled pickup time will result in full charge.</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p><strong className="text-blue-800">Weather Conditions:</strong> In case of severe weather, we may cancel rides for safety. Full refunds will be provided.</p>
                  </div>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <RefreshCw className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Refund Policy</h3>
                </div>
                <div className="space-y-4 text-gray-600">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p><strong>Processing Time:</strong> Refunds are processed within 3-5 business days to your original payment method.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p><strong>Service Issues:</strong> If you experience service issues, please contact us immediately. We will investigate and provide appropriate compensation.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p><strong>Payment Disputes:</strong> For payment disputes, please contact us first before initiating a chargeback.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p><strong>Partial Refunds:</strong> Partial refunds may be provided for service modifications or delays beyond our control.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="h-8 w-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Terms of Service</h3>
              </div>
              <div className="space-y-6 text-gray-600">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p><strong>Service Agreement:</strong> By booking a ride with LETSGOSFO, you agree to our terms of service and policies.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p><strong>Liability:</strong> LETSGOSFO maintains appropriate insurance coverage. Our liability is limited to the cost of the ride service.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p><strong>Passenger Conduct:</strong> Passengers must behave respectfully. We reserve the right to refuse service for inappropriate behavior.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p><strong>Luggage Policy:</strong> Standard luggage allowance applies. Oversized items may incur additional charges.</p>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p><strong>Modifications:</strong> We reserve the right to modify these terms with 30 days notice.</p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-yellow-800 mb-2">Important Notice</h4>
                  <p className="text-yellow-700">
                    These policies are subject to change. We will notify customers of any significant changes via email or website notice. 
                    For questions about our policies, please contact us at <a href="mailto:saadmali@gensosekai.com" className="underline hover:text-yellow-900">saadmali@gensosekai.com</a>.
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
              Questions About Our Policies?
            </h2>
            <p className="text-xl text-blue-100">
              Contact us for clarification on any of our terms and conditions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contact">
                <button className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Contact Us
                </button>
              </Link>
              <Link href="/book">
                <button className="inline-flex items-center justify-center bg-transparent border-2 border-white hover:bg-white text-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Book a Ride
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
