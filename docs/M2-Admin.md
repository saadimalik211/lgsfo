# M2 — Admin Basics

## Goals

- Secure admin access to manage bookings and view details.
- Operational visibility: filters, search, payment status.
- Ability to update ride status and trigger notifications.

## Deliverables

- Admin auth (role-based) and protected routes.
- Booking dashboard: list with filters (date, status, customer), pagination.
- Booking detail page: customer info, locations, schedule, price, payment state.
- API endpoints for admin operations (list, detail, status updates).

## Tasks

- Implement authentication and session management; enforce RBAC.
- Build admin UI components (Table, Filters, Tabs, Badge, Skeleton).
- Add endpoints: `GET /api/admin/bookings`, `GET /api/admin/bookings/:id`, `PATCH /api/admin/bookings/:id`.
- Wire notifications on significant changes (status updates).

## Notes

- Log admin actions for auditability.
- Apply server-side pagination and query validation.


