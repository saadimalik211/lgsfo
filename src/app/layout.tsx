import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GlobalBanner from "@/components/GlobalBanner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LETSGOSFO - Premium Ride Booking",
  description: "Premium ride booking platform for trips across the Greater Bay Area, with a focus on Marin ⇄ SFO routes.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalBanner />
        {children}
      </body>
    </html>
  )
}
