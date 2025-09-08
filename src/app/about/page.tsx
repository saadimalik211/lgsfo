import { Car, Shield, Clock, Phone, Mail, MapPin, CreditCard, Users, Star } from "lucide-react"
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

      {/* Contact Information */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Contact Information
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-600">(607) 542-6874</p>
                <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">saadmali@gensosekai.com</p>
                <p className="text-sm text-gray-500 mt-2">Response within 1 day</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Address</h3>
                <p className="text-gray-600">
                  1746 Carpentier Street<br />
                  San Leandro, CA 94577
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies and Terms */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Policies & Terms
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Cancellation Policy */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Cancellation Policy</h3>
                <div className="space-y-4 text-gray-600">
                  <p><strong>Free Cancellation:</strong> Cancel up to 2 hours before your scheduled pickup time for a full refund.</p>
                  <p><strong>Late Cancellation:</strong> Cancellations within 2 hours of pickup time will incur a 50% charge.</p>
                  <p><strong>No-Show:</strong> Failure to appear at the scheduled pickup time will result in full charge.</p>
                  <p><strong>Weather Conditions:</strong> In case of severe weather, we may cancel rides for safety. Full refunds will be provided.</p>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Refund Policy</h3>
                <div className="space-y-4 text-gray-600">
                  <p><strong>Processing Time:</strong> Refunds are processed within 3-5 business days to your original payment method.</p>
                  <p><strong>Service Issues:</strong> If you experience service issues, please contact us immediately. We will investigate and provide appropriate compensation.</p>
                  <p><strong>Payment Disputes:</strong> For payment disputes, please contact us first before initiating a chargeback.</p>
                  <p><strong>Partial Refunds:</strong> Partial refunds may be provided for service modifications or delays beyond our control.</p>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Terms of Service</h3>
              <div className="space-y-4 text-gray-600">
                <p><strong>Service Agreement:</strong> By booking a ride with LETSGOSFO, you agree to our terms of service and policies.</p>
                <p><strong>Liability:</strong> LETSGOSFO maintains appropriate insurance coverage. Our liability is limited to the cost of the ride service.</p>
                <p><strong>Passenger Conduct:</strong> Passengers must behave respectfully. We reserve the right to refuse service for inappropriate behavior.</p>
                <p><strong>Luggage Policy:</strong> Standard luggage allowance applies. Oversized items may incur additional charges.</p>
                <p><strong>Modifications:</strong> We reserve the right to modify these terms with 30 days notice.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Payment Information */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Security & Payment Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Security */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Security & Privacy</h3>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p><strong>PCI Compliance:</strong> All payment processing is handled securely through Stripe, which is PCI DSS compliant.</p>
                  <p><strong>Data Protection:</strong> We use industry-standard encryption to protect your personal and payment information.</p>
                  <p><strong>Privacy Policy:</strong> We collect and use your information only as necessary to provide our services. We do not sell your data to third parties.</p>
                  <p><strong>Secure Communication:</strong> Our website uses HTTPS encryption for all data transmission.</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Accepted Payment Methods</h3>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">We accept all major credit and debit cards:</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">Visa </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">Mastercard </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">American Express </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium text-gray-700">Discover </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    All payments are processed securely through Stripe. We do not store your payment information on our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
              Legal Information
            </h2>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Insurance Coverage</h3>
                  <p className="text-gray-600">
                    We maintain comprehensive commercial auto insurance coverage as required by California state law. 
                    Coverage includes liability, collision, and comprehensive protection for all passengers and vehicles.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility</h3>
                  <p className="text-gray-600">
                    LETSGOSFO is committed to providing accessible transportation services. We comply with the 
                    Americans with Disabilities Act (ADA) and provide wheelchair-accessible vehicles upon request. 
                    Please contact us in advance to arrange accessible transportation.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Governing Law</h3>
                  <p className="text-gray-600">
                    These terms and conditions are governed by the laws of the State of California. 
                    Any disputes will be resolved in the courts of San Francisco County, California.
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
