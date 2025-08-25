# Payments Integration (Stripe vs Square)

## Summary

Both Stripe and Square can power LETSGOSFO payments. We can start with one and swap to the other by keeping a thin payments abstraction in our backend. MVP can ship with Stripe Checkout or Square Web Payments SDK; both support cards and digital wallets.

## Capabilities

- Stripe: Payment Intents/Elements or hosted Checkout; Apple Pay/Google Pay; strong webhook ecosystem.
- Square: Web Payments SDK (Card, Apple Pay, Google Pay); Payments API; webhooks; good SMB pricing.

## Architecture Choice

- Create a Payments Service in the backend exposing:
  - `createPayment({ bookingId, amount, currency, customer })`
  - `refundPayment({ paymentId, amount })`
  - `handleWebhook(headers, body)` → returns normalized event `{ type, bookingId, status, raw }`
- Implement provider adapters: `StripeAdapter`, `SquareAdapter` behind this interface.
- Select provider via env var `PAYMENTS_PROVIDER=stripe|square`.

## Stripe Path (default)

- Quickest to implement with hosted Checkout.
- Webhooks: `checkout.session.completed`, `payment_intent.*`.
- PCI scope: minimal (SAQ A) when using Checkout.

## Square Path (alternative)

- Use Web Payments SDK for card and wallets; create payment via Payments API.
- Requires an application and access token; use sandbox for test.
- Webhooks: `payment.updated` to confirm success/failed/refunded.
- PCI scope: reduced but similar to Stripe Elements; follow Square guidelines.

## Migration/Swap Strategy

- Keep payment ids stored as `{ provider, externalId }` in `payments` table.
- All business logic references our internal payment id.
- Webhooks routed to `/api/payments/webhook?provider=stripe|square` or single endpoint that detects provider.
- Feature parity checklist: cards, Apple Pay/Google Pay, refunds, receipts.

## Compliance and Security

- Never store raw card data; use provider SDKs only.
- Verify webhook signatures; use idempotency keys for create/refund ops.
- Log events with correlation ids; avoid PII in logs.

## Recommendation

- Start with Stripe Checkout for speed, or Square Web Payments SDK if Square is preferred for business reasons. The abstraction layer ensures we can switch without touching UI/flows.


