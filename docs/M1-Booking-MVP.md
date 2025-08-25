# M1 — Booking MVP

## Goals

- Public booking flow with Google Places autocomplete and date/time selection.
- Pricing estimator with distance/time and Marin ⇄ SFO flat-rate rules.
- Secure checkout and confirmation, with admin notifications.
- Persist bookings and payments; handle payment webhooks.

## Deliverables

- Landing page with clear CTA to booking.
- Booking stepper: Locations → Ride Details → Estimate → Checkout → Confirm.
- `/api/pricing/estimate`, `/api/bookings`, `/api/checkout`, `/api/payments/webhook`.
- Stripe or Square payment integration in test mode.
- Email notifications (customer receipt, admin alert) via chosen provider.

## Functional Flow

1. Locations: collect pickup/dropoff via Places Autocomplete.
2. Ride Details: datetime, passengers, luggage, extras.
3. Estimate: call pricing API (Distance Matrix + rules). Display breakdown and total.
4. Checkout: create booking draft, initialize payment, confirm payment.
5. Confirmation: show receipt, send emails, mark booking/payment status.

## Validation and Security

- Zod validation for all inputs and API payloads.
- Rate-limit pricing and booking endpoints.
- Webhook signature verification and idempotency keys.

## Testing

- Unit tests for pricing rules and helpers.
- Integration tests for booking + payment webhook lifecycle (test mode).
- Basic E2E happy-path booking flow.


