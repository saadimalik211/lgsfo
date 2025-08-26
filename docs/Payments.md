# Payments Integration (Stripe)

## Summary

LETSGOSFO uses Stripe for secure payment processing. We implement a clean abstraction layer that can be extended for future payment providers if needed.

## Stripe Implementation

- **Checkout**: Hosted checkout pages for quick implementation
- **Payment Intents**: For custom payment flows and advanced features
- **Webhooks**: Real-time payment status updates
- **Apple Pay/Google Pay**: Native mobile payment support

## Architecture

- Create a Payments Service in the backend exposing:
  - `createPayment({ bookingId, amount, currency, customer })`
  - `refundPayment({ paymentId, amount })`
  - `handleWebhook(headers, body)` → returns normalized event `{ type, bookingId, status, raw }`
- Implement `StripeAdapter` behind this interface
- Webhook endpoint: `/api/payments/webhook`

## Stripe Setup

- **Checkout Sessions**: For simple payment flows
- **Payment Intents**: For custom payment forms
- **Webhooks**: `checkout.session.completed`, `payment_intent.*`
- **PCI Compliance**: Minimal scope (SAQ A) when using Checkout

## Environment Variables

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Security and Compliance

- Never store raw card data; use Stripe SDKs only
- Verify webhook signatures for all incoming requests
- Use idempotency keys for create/refund operations
- Log events with correlation IDs; avoid PII in logs

## Implementation Notes

- Start with Stripe Checkout for MVP speed
- Can upgrade to Payment Intents + Elements for custom UI later
- Webhook handling is critical for payment status updates
- Test thoroughly with Stripe test mode before going live


