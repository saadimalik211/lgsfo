# M0 — Setup and Foundations

## Goals

- Scaffold Next.js (TypeScript) app with TailwindCSS and Shadcn/Radix UI.
- Establish design tokens and base components.
- Set up API layer boundaries and environment configuration.
- Provision local infrastructure (Docker, Postgres, reverse proxy).
- Define coding standards and quality gates.

## Deliverables

- Next.js App Router project with TypeScript, Tailwind configured.
- Shadcn/Radix installed; base components (Button, Input, Select, Card).
- Environment variables template (`.env.example`) for Maps, Payments, DB, Email.
- Docker Compose for Apple Silicon: app, Postgres, reverse proxy (Traefik/NGINX).
- Prisma schema for Users, Bookings, Payments; initial migration + seed.
- Basic error monitoring and logging scaffolding.
- CI checks: typecheck, lint, format, basic test run.

## Tasks

- Initialize repo; add linting/formatting (ESLint, Prettier) and commit hooks.
- Install dependencies: Next.js, Tailwind, Radix/Shadcn, Prisma, Zod, RHF.
- Create base layout, theme, and global styles.
- Configure Prisma to Postgres; write `prisma/schema.prisma` and run migration.
- Implement health check route and basic API structure.
- Add Dockerfiles and `docker-compose.yml` for app + DB; Apple Silicon base images.
- Configure reverse proxy for SSL termination and routing.

## Notes

- Keep secrets in env files; never expose keys to the client.
- Prefer server components; use client components for interactive form pieces.

## ✅ Completion Checklist

- [x] Next.js 14 project with TypeScript and App Router
- [x] TailwindCSS configured with design system variables
- [x] Shadcn/Radix UI components (Button, Input, Select, Card)
- [x] Prisma schema with Users, Bookings, Payments models
- [x] Environment variables template (env.example)
- [x] Docker configuration (Dockerfile, docker-compose.yml)
- [x] Health check API endpoint (/api/health)
- [x] Basic landing page with UI components
- [x] Utility functions (cn, formatCurrency, formatDateTime)
- [x] Zod validation schemas
- [x] Database utilities and Prisma client setup
- [x] Prettier configuration
- [x] Project documentation and README
- [x] Development server running successfully

## 🚀 Next Steps

With M0 complete, we can now proceed to M1 (Booking MVP) which will include:
- Google Places autocomplete integration
- Booking form with validation
- Pricing estimation API
- Payment integration (Stripe/Square)
- Email notifications

## 🧪 Testing the Setup

1. **Start development server**: `npm run dev`
2. **Test health endpoint**: `curl http://localhost:3000/api/health`
3. **Visit landing page**: http://localhost:3000
4. **Test Docker setup**: `docker-compose up postgres -d`

The application should now be running with a functional landing page, health API endpoint, and all foundational components in place.


