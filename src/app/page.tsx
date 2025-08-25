import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Clock, MapPin, Star, Shield, Zap, Users, Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">LETSGOSFO</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-slate-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                Premium Rides
                <span className="block text-blue-600">Marin ⇄ SFO</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Experience luxury transportation across the Bay Area with professional drivers, 
                premium vehicles, and seamless booking.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                <Car className="mr-2 h-5 w-5" />
                Book Your Ride
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300">
                <MapPin className="mr-2 h-5 w-5" />
                View Routes
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-12 text-slate-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">24/7 Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose LETSGOSFO?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Premium service, professional drivers, and luxury vehicles for your comfort and convenience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Premium Fleet</CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Luxury vehicles maintained to the highest standards
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed">
                  From sedans to SUVs, our fleet features the latest models with premium amenities 
                  including leather seats, climate control, and complimentary WiFi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Expert Drivers</CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Professional, licensed, and background-checked drivers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed">
                  Our drivers are carefully selected, professionally trained, and committed to 
                  providing you with a safe, comfortable, and punctual journey.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-900">Instant Booking</CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Book in seconds, confirm immediately
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-slate-600 leading-relaxed">
                  Our streamlined booking process takes just minutes. Get instant confirmation 
                  and real-time updates on your driver's location and arrival time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="py-20 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Specialized service for the most traveled routes in the Bay Area
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Marin → SFO</CardTitle>
                <CardDescription>From $85</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-xl">SFO → Marin</CardTitle>
                <CardDescription>From $85</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-xl">Oakland → SFO</CardTitle>
                <CardDescription>From $65</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="text-center">
                <MapPin className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle className="text-xl">San Jose → SFO</CardTitle>
                <CardDescription>From $95</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Premium Travel?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Book your ride now and enjoy the comfort, reliability, and luxury you deserve.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <Calendar className="mr-2 h-5 w-5" />
            Book Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Car className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">LETSGOSFO</span>
              </div>
              <p className="text-slate-400">
                Premium ride booking service for the Bay Area.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Airport Transfers</li>
                <li>Corporate Travel</li>
                <li>Special Events</li>
                <li>Hourly Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Contact Us</li>
                <li>FAQ</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-slate-400">
                <li>+1 (415) 555-0123</li>
                <li>info@letsgosfo.com</li>
                <li>24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 LETSGOSFO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
