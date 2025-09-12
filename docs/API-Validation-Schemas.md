# API Validation Schemas

This document provides detailed information about the validation schemas used throughout the LETSGOSFO API.

## Overview

The API uses [Zod](https://zod.dev/) for runtime type validation and schema definition. All schemas are defined in `src/lib/validations.ts` and provide both TypeScript types and runtime validation.

## Core Validation Schemas

### Booking Schema

**File**: `src/lib/validations.ts`  
**Type**: `BookingFormData`

```typescript
const bookingSchema = z.object({
  pickup: z.string().min(1, 'Pickup location is required'),
  dropoff: z.string().min(1, 'Dropoff location is required'),
  datetime: z.string().datetime(),
  passengers: z.number().int().min(1).max(10),
  luggage: z.number().int().min(0).max(10),
  extras: z.array(z.string()).optional(),
  rideType: z.enum(['TESLA_MODEL_Y']).default('TESLA_MODEL_Y'),
  priceCents: z.number().int().positive(),
  // Customer information
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().optional(),
})
```

**Validation Rules:**
- `pickup`: Required string, minimum 1 character
- `dropoff`: Required string, minimum 1 character  
- `datetime`: Required ISO 8601 datetime string
- `passengers`: Required integer between 1-10
- `luggage`: Required integer between 0-10
- `extras`: Optional array of strings
- `rideType`: Enum, defaults to 'TESLA_MODEL_Y'
- `priceCents`: Required positive integer
- `customerName`: Required string, minimum 1 character
- `customerEmail`: Required valid email address
- `customerPhone`: Optional string

**Used in**: `POST /api/bookings`

### Pricing Request Schema

**File**: `src/lib/validations.ts`  
**Type**: `PricingRequest`

```typescript
const pricingRequestSchema = z.object({
  pickup: z.string().min(1),
  dropoff: z.string().min(1),
  datetime: z.string().optional(), // Make datetime optional for pricing
  passengers: z.number().int().min(1).max(10),
  extras: z.array(z.string()).optional(),
  rideType: z.enum(['TESLA_MODEL_Y']).optional().default('TESLA_MODEL_Y'),
})
```

**Validation Rules:**
- `pickup`: Required string, minimum 1 character
- `dropoff`: Required string, minimum 1 character
- `datetime`: Optional ISO 8601 datetime string
- `passengers`: Required integer between 1-10
- `extras`: Optional array of strings
- `rideType`: Optional enum, defaults to 'TESLA_MODEL_Y'

**Used in**: `POST /api/pricing/estimate`

### User Schema

**File**: `src/lib/validations.ts`  
**Type**: `UserData`

```typescript
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'ADMIN', 'DRIVER']).default('CUSTOMER'),
})
```

**Validation Rules:**
- `name`: Required string, minimum 1 character
- `email`: Required valid email address
- `phone`: Optional string
- `role`: Enum with default 'CUSTOMER'

**Used in**: User creation and updates

### Payment Schema

**File**: `src/lib/validations.ts`  
**Type**: `PaymentData`

```typescript
const paymentSchema = z.object({
  bookingId: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().default('USD'),
})
```

**Validation Rules:**
- `bookingId`: Required string, minimum 1 character
- `amountCents`: Required positive integer
- `currency`: String, defaults to 'USD'

**Used in**: Payment processing

### API Response Schema

**File**: `src/lib/validations.ts`  
**Type**: `ApiResponse`

```typescript
const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
})
```

**Validation Rules:**
- `success`: Required boolean
- `data`: Optional any type
- `error`: Optional string

**Used in**: Standardizing API responses

## Admin-Specific Schemas

### Admin Login Schema

**File**: `src/app/api/admin/auth/login/route.ts`

```typescript
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})
```

**Validation Rules:**
- `username`: Required string, minimum 1 character
- `password`: Required string, minimum 1 character

**Used in**: `POST /api/admin/auth/login`

### Admin Booking Update Schema

**File**: `src/app/api/admin/bookings/[id]/route.ts`

```typescript
const updateSchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().optional()
})
```

**Validation Rules:**
- `status`: Optional BookingStatus enum
- `notes`: Optional string

**Used in**: `PATCH /api/admin/bookings/[id]`

### Admin Bookings Query Schema

**File**: `src/app/api/admin/bookings/route.ts`

```typescript
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.nativeEnum(BookingStatus).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  dateFrom: z.string().optional().or(z.literal('')),
  dateTo: z.string().optional().or(z.literal(''))
})
```

**Validation Rules:**
- `page`: Optional string, defaults to '1'
- `limit`: Optional string, defaults to '20'
- `status`: Optional BookingStatus enum or empty string
- `search`: Optional string or empty string
- `dateFrom`: Optional string or empty string
- `dateTo`: Optional string or empty string

**Used in**: `GET /api/admin/bookings`

## Database Enums

### BookingStatus

```typescript
enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED', 
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
```

### PaymentStatus

```typescript
enum PaymentStatus {
  REQUIRES_PAYMENT_METHOD = 'REQUIRES_PAYMENT_METHOD',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  AUTHORIZED = 'AUTHORIZED',
  CANCELLED = 'CANCELLED'
}
```

### PaymentMethod

```typescript
enum PaymentMethod {
  STRIPE = 'STRIPE',
  CASH = 'CASH',
  VENMO = 'VENMO',
  ZELLE = 'ZELLE',
  OTHER = 'OTHER'
}
```

### RideType

```typescript
enum RideType {
  TESLA_MODEL_Y = 'TESLA_MODEL_Y'
}
```

### UserRole

```typescript
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER'
}
```

## Validation Error Handling

### ZodError Response Format

When validation fails, the API returns a structured error response:

```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Pickup location is required",
      "path": ["pickup"]
    }
  ]
}
```

### Common Validation Errors

#### Required Field Missing
```json
{
  "success": false,
  "error": "Invalid booking data"
}
```

#### Invalid Email Format
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

#### Invalid Enum Value
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "invalid_enum_value",
      "options": ["TESLA_MODEL_Y"],
      "path": ["rideType"],
      "message": "Invalid enum value. Expected 'TESLA_MODEL_Y', received 'INVALID_TYPE'"
    }
  ]
}
```

#### Number Range Violation
```json
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Number must be greater than or equal to 1",
      "path": ["passengers"]
    }
  ]
}
```

## Custom Validation Examples

### Date Validation
```typescript
// Ensure datetime is in the future
const futureDateSchema = z.string().datetime().refine(
  (date) => new Date(date) > new Date(),
  { message: "Date must be in the future" }
)
```

### Phone Number Validation
```typescript
// Basic phone number format validation
const phoneSchema = z.string().regex(
  /^\+?[\d\s\-\(\)]+$/,
  "Invalid phone number format"
)
```

### Price Validation
```typescript
// Ensure price is reasonable (between $5 and $1000)
const priceSchema = z.number().int().min(500).max(100000).refine(
  (price) => price % 100 === 0, // Must be in whole dollars
  { message: "Price must be in whole dollars" }
)
```

## Best Practices

### 1. Consistent Error Messages
Always provide clear, user-friendly error messages:
```typescript
z.string().min(1, 'Pickup location is required')
```

### 2. Optional vs Required Fields
Use `.optional()` for truly optional fields:
```typescript
customerPhone: z.string().optional()
```

### 3. Default Values
Provide sensible defaults where appropriate:
```typescript
rideType: z.enum(['TESLA_MODEL_Y']).default('TESLA_MODEL_Y')
```

### 4. Type Safety
Export TypeScript types from schemas:
```typescript
export type BookingFormData = z.infer<typeof bookingSchema>
```

### 5. Runtime Validation
Always validate input at API boundaries:
```typescript
const validatedData = bookingSchema.parse(body)
```

## Testing Validation

### Unit Test Example
```typescript
import { bookingSchema } from '@/lib/validations'

describe('Booking Schema', () => {
  it('should validate correct booking data', () => {
    const validBooking = {
      pickup: 'SFO',
      dropoff: 'Union Square',
      datetime: '2024-01-15T14:30:00.000Z',
      passengers: 2,
      luggage: 1,
      rideType: 'TESLA_MODEL_Y',
      priceCents: 4500,
      customerName: 'John Doe',
      customerEmail: 'john@example.com'
    }
    
    expect(() => bookingSchema.parse(validBooking)).not.toThrow()
  })
  
  it('should reject invalid email', () => {
    const invalidBooking = {
      // ... other valid fields
      customerEmail: 'invalid-email'
    }
    
    expect(() => bookingSchema.parse(invalidBooking)).toThrow()
  })
})
```

## Migration and Updates

When updating validation schemas:

1. **Backward Compatibility**: Ensure existing data still validates
2. **Database Migrations**: Update database schema if needed
3. **API Versioning**: Consider versioning for breaking changes
4. **Client Updates**: Update frontend validation to match
5. **Documentation**: Update API documentation

## Performance Considerations

- **Early Validation**: Validate input as early as possible
- **Caching**: Cache compiled schemas for better performance
- **Error Handling**: Don't expose internal validation details in production
- **Logging**: Log validation failures for debugging
