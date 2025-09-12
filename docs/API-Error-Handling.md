# API Error Handling Documentation

This document provides comprehensive information about error handling, status codes, and error responses in the LETSGOSFO API.

## Overview

The API follows RESTful conventions for HTTP status codes and provides consistent error response formats. All errors are logged for debugging purposes while maintaining security by not exposing sensitive internal information.

## Standard Error Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### Validation Error Response
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

## HTTP Status Codes

### 2xx Success
- **200 OK**: Request successful
- **201 Created**: Resource created successfully

### 4xx Client Errors
- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Authentication required or failed
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists or conflict with current state

### 5xx Server Errors
- **500 Internal Server Error**: Unexpected server error
- **502 Bad Gateway**: External service error (e.g., Stripe API)
- **503 Service Unavailable**: Service temporarily unavailable

## Error Categories

### 1. Validation Errors (400)

#### Input Validation Failures
```json
{
  "success": false,
  "error": "Invalid booking data"
}
```

**Common Causes:**
- Missing required fields
- Invalid data types
- Value out of allowed range
- Invalid email format
- Invalid datetime format

**Example Validation Errors:**
```json
// Missing required field
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

// Invalid email
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "invalid_string",
      "validation": "email",
      "message": "Invalid email address",
      "path": ["customerEmail"]
    }
  ]
}

// Value out of range
{
  "success": false,
  "error": "Invalid input",
  "details": [
    {
      "code": "too_big",
      "maximum": 10,
      "type": "number",
      "inclusive": true,
      "exact": false,
      "message": "Number must be less than or equal to 10",
      "path": ["passengers"]
    }
  ]
}
```

#### Business Logic Validation
```json
{
  "success": false,
  "error": "Payment already exists for this booking"
}
```

**Common Business Logic Errors:**
- Duplicate payment attempts
- Invalid booking state transitions
- Insufficient permissions for action

### 2. Authentication Errors (401)

#### Missing Authentication
```json
{
  "error": "Not authenticated"
}
```

#### Invalid Credentials
```json
{
  "error": "Invalid credentials"
}
```

#### Session Expired
```json
{
  "authenticated": false
}
```

**Authentication Error Scenarios:**
- Missing admin session cookie
- Invalid session token
- Expired session
- Invalid username/password combination

### 3. Authorization Errors (403)

Currently not implemented, but would be used for:
- Insufficient permissions for specific actions
- Role-based access control violations

### 4. Not Found Errors (404)

#### Resource Not Found
```json
{
  "success": false,
  "error": "Booking not found"
}
```

**Common Not Found Scenarios:**
- Booking ID doesn't exist
- Payment record not found
- User not found
- Invalid endpoint URL

### 5. Conflict Errors (409)

#### Duplicate Resource
```json
{
  "success": false,
  "error": "Payment already exists for this booking"
}
```

**Common Conflict Scenarios:**
- Attempting to create duplicate payment
- Booking already in final state
- Email already registered

### 6. External Service Errors (502)

#### Stripe API Errors
```json
{
  "error": "Failed to capture payment",
  "details": "Your card was declined."
}
```

**Stripe Error Examples:**
```json
// Card declined
{
  "error": "Failed to capture payment",
  "details": "Your card was declined."
}

// Insufficient funds
{
  "error": "Failed to capture payment", 
  "details": "Your card has insufficient funds."
}

// Invalid card
{
  "error": "Failed to capture payment",
  "details": "Your card number is incorrect."
}
```

#### Google Maps API Errors
```json
{
  "success": false,
  "error": "Unable to calculate distance and pricing"
}
```

**Google Maps Error Scenarios:**
- Invalid addresses
- API quota exceeded
- Network connectivity issues
- Invalid API key

### 7. Internal Server Errors (500)

#### Database Errors
```json
{
  "success": false,
  "error": "Failed to create booking"
}
```

#### Configuration Errors
```json
{
  "error": "Stripe not configured"
}
```

#### Unexpected Errors
```json
{
  "error": "Internal server error"
}
```

## Error Handling Implementation

### 1. Try-Catch Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)
    
    // Business logic here
    
    return NextResponse.json({
      success: true,
      data: result
    })
    
  } catch (error) {
    console.error('Booking creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid booking data' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
```

### 2. Validation Error Handling

```typescript
try {
  const validatedData = schema.parse(body)
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid input', 
        details: error.issues 
      },
      { status: 400 }
    )
  }
}
```

### 3. Authentication Error Handling

```typescript
const session = await getAdminSession()
if (!session.isAuthenticated) {
  return NextResponse.json(
    { error: 'Not authenticated' },
    { status: 401 }
  )
}
```

### 4. Database Error Handling

```typescript
try {
  const booking = await prisma.booking.findUnique({
    where: { id }
  })
  
  if (!booking) {
    return NextResponse.json(
      { success: false, error: 'Booking not found' },
      { status: 404 }
    )
  }
} catch (error) {
  console.error('Database error:', error)
  return NextResponse.json(
    { success: false, error: 'Failed to fetch booking' },
    { status: 500 }
  )
}
```

### 5. External Service Error Handling

```typescript
try {
  const session = await stripe.checkout.sessions.create({
    // Stripe configuration
  })
} catch (stripeError: any) {
  console.error('Stripe error:', stripeError)
  return NextResponse.json(
    { 
      success: false, 
      error: 'Failed to create payment authorization',
      details: stripeError.message 
    },
    { status: 502 }
  )
}
```

## Error Logging

### 1. Console Logging
All errors are logged to the console for debugging:

```typescript
console.error('Booking creation error:', error)
console.error('Stripe error:', stripeError)
console.error('Database error:', error)
```

### 2. Structured Logging
Consider implementing structured logging in production:

```typescript
logger.error('Booking creation failed', {
  error: error.message,
  stack: error.stack,
  userId: session?.userId,
  bookingId: bookingId,
  timestamp: new Date().toISOString()
})
```

### 3. Error Monitoring
For production, consider integrating error monitoring services:
- Sentry
- LogRocket
- DataDog
- New Relic

## Client-Side Error Handling

### 1. HTTP Status Code Handling

```typescript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookingData)
})

if (!response.ok) {
  const error = await response.json()
  
  switch (response.status) {
    case 400:
      // Handle validation errors
      console.error('Validation error:', error.details)
      break
    case 401:
      // Handle authentication errors
      redirect('/admin/login')
      break
    case 404:
      // Handle not found errors
      console.error('Resource not found:', error.error)
      break
    case 500:
      // Handle server errors
      console.error('Server error:', error.error)
      break
  }
}
```

### 2. Error Message Display

```typescript
const handleApiError = (error: any) => {
  if (error.details) {
    // Display validation errors
    error.details.forEach((detail: any) => {
      showFieldError(detail.path[0], detail.message)
    })
  } else {
    // Display general error message
    showNotification(error.error, 'error')
  }
}
```

## Error Recovery Strategies

### 1. Retry Logic
For transient errors (network, temporary service unavailability):

```typescript
const retryApiCall = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

### 2. Fallback Mechanisms
For external service failures:

```typescript
const calculatePrice = async (pickup: string, dropoff: string) => {
  try {
    // Try Google Maps API
    return await calculateDistanceWithGoogleMaps(pickup, dropoff)
  } catch (error) {
    console.warn('Google Maps API failed, using fallback')
    // Fallback to estimated distance
    return estimateDistance(pickup, dropoff)
  }
}
```

### 3. Graceful Degradation
For non-critical features:

```typescript
try {
  await sendConfirmationEmail(booking)
} catch (error) {
  console.warn('Email sending failed, but booking was created')
  // Continue with booking creation
}
```

## Testing Error Scenarios

### 1. Unit Tests

```typescript
describe('Error Handling', () => {
  it('should return 400 for invalid booking data', async () => {
    const invalidBooking = { pickup: '' } // Missing required fields
    
    const response = await POST('/api/bookings', invalidBooking)
    
    expect(response.status).toBe(400)
    expect(response.json().success).toBe(false)
  })
  
  it('should return 404 for non-existent booking', async () => {
    const response = await GET('/api/bookings/non-existent-id')
    
    expect(response.status).toBe(404)
    expect(response.json().error).toBe('Booking not found')
  })
})
```

### 2. Integration Tests

```typescript
describe('Payment Error Handling', () => {
  it('should handle Stripe API failures gracefully', async () => {
    // Mock Stripe API to return error
    mockStripe.checkout.sessions.create.mockRejectedValue(
      new Error('Stripe API error')
    )
    
    const response = await POST('/api/checkout', {
      bookingId: 'valid-booking-id'
    })
    
    expect(response.status).toBe(502)
    expect(response.json().error).toContain('Failed to create payment')
  })
})
```

## Security Considerations

### 1. Information Disclosure
- Don't expose internal error details in production
- Log detailed errors server-side only
- Return generic error messages to clients

### 2. Error Message Sanitization
```typescript
const sanitizeError = (error: any) => {
  if (process.env.NODE_ENV === 'production') {
    return 'An unexpected error occurred'
  }
  return error.message
}
```

### 3. Rate Limiting
Consider implementing rate limiting to prevent abuse:
- Per IP address
- Per user account
- Per endpoint

## Monitoring and Alerting

### 1. Error Rate Monitoring
- Track error rates by endpoint
- Set up alerts for high error rates
- Monitor error trends over time

### 2. Performance Monitoring
- Track response times
- Monitor database query performance
- Track external API response times

### 3. Business Metrics
- Track booking success rates
- Monitor payment failure rates
- Track customer satisfaction metrics

## Best Practices

### 1. Consistent Error Format
- Use consistent error response structure
- Provide meaningful error messages
- Include error codes for programmatic handling

### 2. Appropriate Status Codes
- Use correct HTTP status codes
- Don't use 500 for client errors
- Use 4xx for client errors, 5xx for server errors

### 3. Error Logging
- Log all errors with context
- Include request IDs for tracing
- Don't log sensitive information

### 4. User Experience
- Provide actionable error messages
- Offer recovery suggestions
- Maintain application state on errors

### 5. Documentation
- Document all possible error responses
- Provide error code references
- Include troubleshooting guides
