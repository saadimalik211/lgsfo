# LETSGOSFO Web App

A premium ride booking platform for trips across the Greater Bay Area,
with a focus on Marin ⇄ SFO routes. Built to be mobile-first, secure,
and scalable.

------------------------------------------------------------------------

## 🚀 Core Concept

LETSGOSFO offers premium rides with an easy-to-use web application.
Customers can book rides, view pricing, and pay securely online. Admins
can manage bookings and track rides.

------------------------------------------------------------------------

## 👥 User Roles

-   **Riders (Customers)**
    -   Book rides, select services, pay securely, and receive
        confirmations.
-   **Admin (LETSGOSFO Team)**
    -   Manage bookings, see ride details, track payments, and
        optionally assign drivers.
-   **Drivers (Future Phase)**
    -   View assigned rides and schedules.

------------------------------------------------------------------------

## 📦 Core Features

### Customer-Facing

-   **Landing Page**: Premium, mobile-first design with "Book Your Ride"
    CTA.
-   **Booking Form**:
    -   Pickup & dropoff (Google Maps autocomplete).
    -   Date/time picker.
    -   Passenger & luggage count.
    -   Optional extras (baby seat, SUV, etc.).
-   **Pricing Estimator**:
    -   Dynamic pricing (based on distance/time).
    -   Option for flat rates on Marin ⇄ SFO.
-   **Checkout**:
    -   Contact info + Stripe payment gateway.
    -   Confirmation screen + email/SMS receipt.
-   **Customer Dashboard (Future)**:
    -   View past and upcoming trips.

### Admin-Facing

-   **Booking Dashboard**:
    -   View/manage bookings, filter by date or customer.
-   **Ride Details Page**:
    -   Customer info, pickup/dropoff, payment status.
-   **Notifications**:
    -   Email/SMS alerts for new bookings.

------------------------------------------------------------------------

## 🛠 Tech Stack Proposal

-   **Frontend**: Next.js (React + TypeScript), TailwindCSS,
    Shadcn/Radix.
-   **Backend**: Next.js API routes (scalable to separate service if
    needed).
-   **Database**: PostgreSQL (recommended), SQLite for local dev.
-   **Payments**: Stripe integration.
-   **Maps API**: Google Maps Places API for autocomplete + distance.
-   **Hosting**:
    -   Initial: Self-hosted on Apple Silicon (Docker recommended).
    -   Future: Vercel or other managed platform.

------------------------------------------------------------------------

## 📱 Mobile-First Design

-   Responsive UI/UX, optimized for mobile booking flow.
-   Accessible components with aria-labels, keyboard navigation, and
    screen reader support.

------------------------------------------------------------------------

## 📊 Data Model (Entities)

**Users** - id, name, email, phone, role (customer/admin/driver)

**Bookings** - id, user_id, pickup_location, dropoff_location, datetime,
passengers, luggage, extras, ride_type, status

**Payments** - id, booking_id, stripe_payment_id, amount, status

**Drivers (Future)** - id, name, license, assigned_rides

------------------------------------------------------------------------

## 🔄 User Flow

1.  **Landing Page**
    -   User clicks "Book a Ride".
2.  **Booking Form**
    -   Pickup + dropoff via autocomplete.
    -   Date/time, passengers, luggage, extras.
    -   User clicks "Get Price".
3.  **Price Estimate**
    -   Dynamic calculation (distance/time).
    -   User clicks "Continue to Checkout".
4.  **Checkout**
    -   Contact details + payment (Stripe).
    -   Booking saved in database.
5.  **Confirmation**
    -   Success screen + email confirmation.
    -   Admin notified.
6.  **Admin Dashboard**
    -   Manage bookings, see details, update status.

------------------------------------------------------------------------

## 🗂 Deployment Notes

-   Run on Apple Silicon (M1/M2/M3/M4) using Docker for consistency.
-   Database: PostgreSQL container (with volume for persistence).
-   App: Next.js app container with API routes + frontend.
-   Reverse proxy (NGINX/Traefik) for SSL and routing.

------------------------------------------------------------------------

## ✅ Next Steps

1.  Build MVP: Booking flow + Stripe + admin notifications.
2.  Deploy locally (Apple Silicon, Docker).
3.  Add Admin Dashboard + Customer Accounts.
4.  Future: Driver portal, loyalty features, native app.
