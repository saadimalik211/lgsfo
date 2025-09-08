import { Shield, CreditCard, Lock, Eye, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function Security() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Section */}
      <section className="bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Security & Payment Information
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Your security and privacy are our top priorities
            </p>
          </div>
        </div>
      </section>

      {/* Security Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Security & Privacy */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="h-8 w-8 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Security & Privacy</h3>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">PCI Compliance</h4>
                        <p className="text-green-700 text-sm">All payment processing is handled securely through Stripe, which is PCI DSS compliant.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Data Protection</h4>
                        <p className="text-blue-700 text-sm">We use industry-standard encryption to protect your personal and payment information.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Eye className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-1">Privacy Policy</h4>
                        <p className="text-purple-700 text-sm">We collect and use your information only as necessary to provide our services. We do not sell your data to third parties.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-indigo-800 mb-1">Secure Communication</h4>
                        <p className="text-indigo-700 text-sm">Our website uses HTTPS encryption for all data transmission.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Accepted Payment Methods</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-600">We accept all major credit and debit cards:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-100 px-4 py-3 rounded-lg text-center font-medium text-gray-700">Visa</div>
                    <div className="bg-gray-100 px-4 py-3 rounded-lg text-center font-medium text-gray-700">Mastercard</div>
                    <div className="bg-gray-100 px-4 py-3 rounded-lg text-center font-medium text-gray-700">American Express</div>
                    <div className="bg-gray-100 px-4 py-3 rounded-lg text-center font-medium text-gray-700">Discover</div>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Important:</strong> All payments are processed securely through Stripe. We do not store your payment information on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Process */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Our Payment Process Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Authorization</h4>
                  <p className="text-gray-600 text-sm">Your payment is authorized when you book, but not charged immediately.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Service Completion</h4>
                  <p className="text-gray-600 text-sm">Payment is captured only after your ride is completed successfully.</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure Processing</h4>
                  <p className="text-gray-600 text-sm">All transactions are processed securely through Stripe's platform.</p>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Security Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">SSL/TLS Encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">PCI DSS Compliance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Secure Data Storage</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Fraud Protection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Regular Security Audits</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Privacy Protection</span>
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
              Book with Confidence
            </h2>
            <p className="text-xl text-blue-100">
              Your payment information is secure and protected
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/book">
                <button className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Book Securely Now
                </button>
              </Link>
              <Link href="/contact">
                <button className="inline-flex items-center justify-center bg-transparent border-2 border-white hover:bg-white text-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
