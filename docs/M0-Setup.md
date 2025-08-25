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


