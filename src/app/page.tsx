import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to LETSGOSFO
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Premium ride booking platform for trips across the Greater Bay Area, 
          with a focus on Marin ⇄ SFO routes.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button size="lg">
            Book Your Ride
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Premium Service</CardTitle>
            <CardDescription>
              Professional drivers and luxury vehicles for your comfort.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Experience the difference with our premium ride service across the Bay Area.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Easy Booking</CardTitle>
            <CardDescription>
              Simple online booking with instant confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Book your ride in minutes with our streamlined booking process.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marin ⇄ SFO</CardTitle>
            <CardDescription>
              Specialized routes between Marin County and SFO.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Dedicated service for the most popular route in the Bay Area.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
