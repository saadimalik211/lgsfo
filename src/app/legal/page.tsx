import { Scale, Shield, Users, FileText, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Legal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Legal Information
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Important legal information about our services and operations
            </p>
          </div>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            
            {/* Insurance Coverage */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900">Insurance Coverage</h3>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">Comprehensive Coverage</h4>
                  <p className="text-green-700">
                    We maintain comprehensive commercial auto insurance coverage as required by California state law. 
                    Coverage includes liability, collision, and comprehensive protection for all passengers and vehicles.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Liability Coverage</h5>
                    <p className="text-gray-600 text-sm">Protection for bodily injury and property damage to third parties.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Collision Coverage</h5>
                    <p className="text-gray-600 text-sm">Protection for damage to our vehicles in case of accidents.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Comprehensive Coverage</h5>
                    <p className="text-gray-600 text-sm">Protection against theft, vandalism, and other non-collision incidents.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Passenger Coverage</h5>
                    <p className="text-gray-600 text-sm">Additional protection specifically for passenger safety and medical expenses.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-8 w-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Accessibility</h3>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">ADA Compliance</h4>
                  <p className="text-blue-700">
                    LETSGOSFO is committed to providing accessible transportation services. We comply with the 
                    Americans with Disabilities Act (ADA) and provide wheelchair-accessible vehicles upon request. 
                    Please contact us in advance to arrange accessible transportation.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Wheelchair Accessible Vehicles</h5>
                    <p className="text-gray-600 text-sm">Available upon request with advance notice.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Assistance Services</h5>
                    <p className="text-gray-600 text-sm">Our drivers are trained to assist passengers with mobility needs.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Service Animals</h5>
                    <p className="text-gray-600 text-sm">Service animals are welcome in all our vehicles.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Communication Support</h5>
                    <p className="text-gray-600 text-sm">We provide support for passengers with hearing or visual impairments.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Governing Law */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Scale className="h-8 w-8 text-indigo-600" />
                <h3 className="text-2xl font-bold text-gray-900">Governing Law</h3>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-indigo-800 mb-3">Legal Jurisdiction</h4>
                  <p className="text-indigo-700">
                    These terms and conditions are governed by the laws of the State of California. 
                    Any disputes arising from our services will be resolved in accordance with California state law.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">State Regulations</h5>
                    <p className="text-gray-600 text-sm">We comply with all California transportation regulations and licensing requirements.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Dispute Resolution</h5>
                    <p className="text-gray-600 text-sm">Disputes will be resolved through California courts or arbitration as appropriate.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Licensing</h5>
                    <p className="text-gray-600 text-sm">We maintain all required business licenses and permits for operation in California.</p>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h5 className="font-semibold text-gray-900 mb-2">Tax Compliance</h5>
                    <p className="text-gray-600 text-sm">All applicable taxes are included in our pricing and remitted as required by law.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Disclaimers */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">Important Legal Disclaimers</h4>
                  <div className="space-y-3 text-yellow-700">
                    <p>• LETSGOSFO operates as a transportation service provider and is not responsible for delays caused by traffic, weather, or other circumstances beyond our control.</p>
                    <p>• Passengers are responsible for their personal belongings during transportation.</p>
                    <p>• We reserve the right to refuse service to anyone who poses a safety risk or violates our terms of service.</p>
                    <p>• All pricing is subject to change with 30 days notice.</p>
                    <p>• For legal questions or concerns, please contact us at <a href="mailto:saadmali@gensosekai.com" className="underline hover:text-yellow-900">saadmali@gensosekai.com</a>.</p>
                  </div>
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
              Questions About Our Legal Information?
            </h2>
            <p className="text-xl text-blue-100">
              Contact us for clarification on any legal matters
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
