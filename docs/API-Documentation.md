# LETSGOSFO API Documentation

## Overview

The LETSGOSFO API provides endpoints for managing Tesla Model Y ride bookings, payments, and administrative functions. The API is built with Next.js 14 App Router and uses Prisma with PostgreSQL for data persistence.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

### Admin Authentication
Admin endpoints require authentication via session cookies. The admin authentication system uses:
- Username/password credentials stored in environment variables
- Base64-encoded session tokens with 24-hour expiration
- HTTP-only cookies for session management

**Environment Variables:**
- `ADMIN_USERNAME` - Admin username (default: "admin")
- `ADMIN_PASSWORD` - Admin password (default: "admin123")

## API Endpoints

### Health Check

#### GET `/api/health`
Check API health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "LETSGOSFO API",
  "version": "1.0.0"
}
```

---

### Pricing

#### POST `/api/pricing/estimate`
Calculate ride pricing based on pickup/dropoff locations.

**Request Body:**
```json
{
  "pickup": "San Francisco International Airport",
  "dropoff": "Union Square, San Francisco",
  "passengers": 2,
  "rideType": "TESLA_MODEL_Y",
  "extras": ["child_seat"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCents": 4500,
    "breakdown": {
      "basePrice": 500,
      "distanceCost": 3500,
      "passengerSurcharge": 0,
      "distanceMiles": 15.2
    },
    "currency": "USD"
  }
}
```

**Pricing Logic:**
- Base fare: $5.00
- Distance pricing: Tiered system starting at $1.80/mile, decreasing by $0.10 every 10 miles (minimum $1.00/mile)
- Passenger surcharge: $5.00 per passenger over 2
- Distance calculated using Google Maps Distance Matrix API

---

### Bookings

#### POST `/api/bookings`
Create a new booking.

**Request Body:**
```json
{
  "pickup": "San Francisco International Airport",
  "dropoff": "Union Square, San Francisco",
  "datetime": "2024-01-15T14:30:00.000Z",
  "passengers": 2,
  "luggage": 1,
  "extras": ["child_seat"],
  "rideType": "TESLA_MODEL_Y",
  "priceCents": 4500,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "clx1234567890",
    "status": "PENDING"
  }
}
```

#### GET `/api/bookings`
Retrieve bookings with optional filtering and pagination.

**Query Parameters:**
- `status` (optional): Filter by booking status
- `limit` (optional): Number of results per page (default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "clx1234567890",
        "pickup": "SFO",
        "dropoff": "Union Square",
        "datetime": "2024-01-15T14:30:00.000Z",
        "passengers": 2,
        "status": "PENDING",
        "priceCents": 4500,
        "user": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890"
        },
        "payments": [
          {
            "status": "AUTHORIZED",
            "amountCents": 4500
          }
        ]
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### GET `/api/bookings/[id]`
Retrieve a specific booking by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "pickup": "SFO",
    "dropoff": "Union Square",
    "datetime": "2024-01-15T14:30:00.000Z",
    "passengers": 2,
    "luggage": 1,
    "extras": ["child_seat"],
    "rideType": "TESLA_MODEL_Y",
    "priceCents": 4500,
    "status": "PENDING",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "payments": [
      {
        "id": "pay_1234567890",
        "status": "AUTHORIZED",
        "amountCents": 4500,
        "currency": "USD",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### PATCH `/api/bookings/[id]`
Update a booking's status.

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx1234567890",
    "status": "CONFIRMED",
    // ... other booking fields
  }
}
```

---

### Payment Processing

#### POST `/api/checkout`
Create a Stripe checkout session for payment authorization.

**Request Body:**
```json
{
  "bookingId": "clx1234567890",
  "customerEmail": "john@example.com",
  "customerName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_1234567890",
    "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
  }
}
```

**Payment Flow:**
1. Creates Stripe checkout session with manual capture
2. Customer completes payment authorization
3. Payment is held (not charged) until ride completion
4. Admin can capture payment after ride completion

#### POST `/api/bookings/cash-payment`
Process a cash payment booking.

**Request Body:**
```json
{
  "bookingId": "clx1234567890",
  "customerEmail": "john@example.com",
  "customerName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "clx1234567890",
    "paymentMethod": "cash",
    "status": "confirmed"
  }
}
```

---

### Webhooks

#### POST `/api/webhooks/stripe`
Handle Stripe webhook events for payment processing.

**Supported Events:**
- `checkout.session.completed` - Payment authorization completed
- `payment_intent.succeeded` - Payment captured successfully
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.requires_action` - Additional authentication required
- `payment_intent.canceled` - Payment canceled

**Response:**
```json
{
  "received": true
}
```

---

### Admin Endpoints

#### POST `/api/admin/auth/login`
Authenticate admin user.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true
}
```

#### GET `/api/admin/auth/check`
Check admin authentication status.

**Response:**
```json
{
  "authenticated": true,
  "username": "admin"
}
```

#### POST `/api/admin/auth/logout`
Logout admin user.

**Response:**
```json
{
  "success": true
}
```

#### GET `/api/admin/bookings`
Retrieve all bookings for admin dashboard.

**Response:**
```json
{
  "bookings": [
    {
      "id": "clx1234567890",
      "pickup": "SFO",
      "dropoff": "Union Square",
      "datetime": "2024-01-15T14:30:00.000Z",
      "passengers": 2,
      "status": "PENDING",
      "priceCents": 4500,
      "user": {
        "id": "user_1234567890",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "payments": [
        {
          "id": "pay_1234567890",
          "stripePaymentId": "pi_1234567890",
          "stripePaymentIntentId": "pi_1234567890",
          "amountCents": 4500,
          "currency": "USD",
          "status": "AUTHORIZED",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "pages": 2
  }
}
```

#### GET `/api/admin/bookings/[id]`
Retrieve detailed booking information for admin.

**Response:**
```json
{
  "booking": {
    "id": "clx1234567890",
    "pickup": "SFO",
    "dropoff": "Union Square",
    "datetime": "2024-01-15T14:30:00.000Z",
    "passengers": 2,
    "luggage": 1,
    "extras": ["child_seat"],
    "rideType": "TESLA_MODEL_Y",
    "priceCents": 4500,
    "status": "PENDING",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "user": {
      "id": "user_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "payments": [
      {
        "id": "pay_1234567890",
        "stripePaymentId": "pi_1234567890",
        "stripePaymentIntentId": "pi_1234567890",
        "amountCents": 4500,
        "currency": "USD",
        "status": "AUTHORIZED",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### PATCH `/api/admin/bookings/[id]`
Update booking status and notes.

**Request Body:**
```json
{
  "status": "COMPLETED",
  "notes": "Ride completed successfully"
}
```

**Response:**
```json
{
  "booking": {
    "id": "clx1234567890",
    "status": "COMPLETED",
    "notes": "Ride completed successfully",
    // ... other booking fields
  }
}
```

#### DELETE `/api/admin/bookings/[id]`
Delete a booking and refund any successful payments.

**Response:**
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

**Note:** This endpoint automatically refunds any successful Stripe payments before deleting the booking.

#### POST `/api/admin/bookings/[id]/capture`
Capture an authorized payment after ride completion.

**Response:**
```json
{
  "success": true,
  "message": "Payment captured successfully",
  "paymentIntent": {
    "id": "pi_1234567890",
    "status": "succeeded",
    "amount": 4500
  }
}
```

---

## Data Models

### Booking
```typescript
interface Booking {
  id: string
  userId?: string
  pickup: string
  dropoff: string
  datetime: Date
  passengers: number
  luggage: number
  extras?: string[]
  rideType: 'TESLA_MODEL_Y'
  distanceKm?: number
  durationMin?: number
  priceCents: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
  customerEmail?: string
  customerName?: string
  customerPhone?: string
  user?: User
  payments: Payment[]
}
```

### Payment
```typescript
interface Payment {
  id: string
  bookingId: string
  stripePaymentId?: string
  amountCents: number
  currency: string
  status: 'REQUIRES_PAYMENT_METHOD' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'AUTHORIZED' | 'CANCELLED'
  createdAt: Date
  updatedAt: Date
  stripePaymentIntentId?: string
  paymentMethod: 'STRIPE' | 'CASH' | 'VENMO' | 'ZELLE' | 'OTHER'
  booking: Booking
}
```

### User
```typescript
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN' | 'DRIVER'
  createdAt: Date
  updatedAt: Date
  bookings: Booking[]
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Scenarios
- **Validation Errors**: Invalid input data format
- **Authentication Errors**: Missing or invalid admin credentials
- **Not Found Errors**: Booking or resource doesn't exist
- **Payment Errors**: Stripe API failures or payment processing issues
- **Database Errors**: Connection or query failures

---

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook endpoint secret

### Optional
- `ADMIN_USERNAME` - Admin username (default: "admin")
- `ADMIN_PASSWORD` - Admin password (default: "admin123")
- `GOOGLE_MAPS_API_KEY` - For distance calculations
- `NEXTAUTH_URL` - Base URL for redirects

---

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

---

## Security Considerations

1. **Admin Authentication**: Uses HTTP-only cookies with 24-hour expiration
2. **Input Validation**: All inputs validated using Zod schemas
3. **SQL Injection**: Protected by Prisma ORM
4. **Webhook Security**: Stripe webhooks verified using signature validation
5. **Environment Variables**: Sensitive data stored in environment variables

---

## Testing

### Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

### Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "pickup": "SFO",
    "dropoff": "Union Square",
    "datetime": "2024-01-15T14:30:00.000Z",
    "passengers": 2,
    "luggage": 1,
    "rideType": "TESLA_MODEL_Y",
    "priceCents": 4500,
    "customerName": "John Doe",
    "customerEmail": "john@example.com"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

---

## Changelog

### Version 1.0.0
- Initial API implementation
- Booking management
- Payment processing with Stripe
- Admin authentication and management
- Pricing calculation with Google Maps integration
