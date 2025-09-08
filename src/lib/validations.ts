import { z } from 'zod'

// Booking validation schemas
export const bookingSchema = z.object({
  pickup: z.string().min(1, 'Pickup location is required'),
  dropoff: z.string().min(1, 'Dropoff location is required'),
  datetime: z.string().datetime(),
  passengers: z.number().int().min(1).max(10),
  luggage: z.number().int().min(0).max(10),
  extras: z.array(z.string()).optional(),
  rideType: z.enum(['STANDARD', 'SUV', 'LUXURY']).default('STANDARD'),
  priceCents: z.number().int().positive(),
  // Customer information
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
})

export const pricingRequestSchema = z.object({
  pickup: z.string().min(1),
  dropoff: z.string().min(1),
  datetime: z.string().optional(), // Make datetime optional for pricing
  passengers: z.number().int().min(1).max(10),
  extras: z.array(z.string()).optional(),
  rideType: z.enum(['STANDARD', 'SUV', 'LUXURY']).optional().default('STANDARD'),
})

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN', 'DRIVER']).default('CUSTOMER'),
})

// Payment validation schemas
export const paymentSchema = z.object({
  bookingId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().default('USD'),
})

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>
export type PricingRequest = z.infer<typeof pricingRequestSchema>
export type UserData = z.infer<typeof userSchema>
export type PaymentData = z.infer<typeof paymentSchema>
export type ApiResponse = z.infer<typeof apiResponseSchema>
