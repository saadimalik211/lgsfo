# M3 — Customer Accounts

## Goals

- Enable customers to sign up/sign in and view trips.
- Manage profile and saved locations.
- Access receipts and payment history.

## Deliverables

- Auth flows (passwordless email or credentials/OAuth via NextAuth).
- Customer dashboard: upcoming/past trips, receipt download.
- Profile page: name, phone, email preferences, saved locations.

## Tasks

- Implement auth provider and session handling.
- Build dashboard pages and components (List, Card, Empty State, Skeleton).
- Expose `/api/customer/bookings` and `/api/customer/profile` endpoints.

## Notes

- Ensure PII is protected; return minimal data required per view.
- Add rate limiting and CSRF protections where applicable.


