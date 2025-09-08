# LETSGOSFO

A premium ride booking platform for trips across the Greater Bay Area, with a focus on Marin ⇄ SFO routes. Built to be mobile-first, secure, and scalable.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose 2.0+
- At least 2GB RAM available for containers

### Option 1: Docker Development (Recommended)

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd lgsfo
   cp env.example settings.env
   ```

2. **Configure environment**
   Edit `settings.env` with your actual API keys:
   ```bash
   # Required: Update these with your actual values
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   RESEND_API_KEY=re_your_resend_key
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health
   - Traefik Dashboard: http://localhost:8080

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Local Development

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd lgsfo
   cp env.example .env.local
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   # Using Docker (recommended)
   docker-compose up postgres -d
   
   # Or install PostgreSQL locally
   # Update DATABASE_URL in .env.local
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   - Frontend: http://localhost:3000
   - API Health: http://localhost:3000/api/health

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **UI Components**: Radix UI, Shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Forms**: React Hook Form
- **Payments**: Stripe/Square (configurable)
- **Maps**: Google Maps API
- **Deployment**: Docker, Apple Silicon optimized

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Landing page
├── components/         # Reusable components
│   └── ui/            # Base UI components
├── lib/               # Utilities and configurations
│   ├── db.ts          # Database setup
│   ├── utils.ts       # Utility functions
│   └── validations.ts # Zod schemas
└── types/             # TypeScript type definitions

prisma/
└── schema.prisma      # Database schema

docs/                  # Project documentation
├── README.md          # Documentation index
├── M0-Setup.md        # Setup milestone
├── M1-Booking-MVP.md  # Booking MVP
├── M2-Admin.md        # Admin features
├── M3-Accounts.md     # Customer accounts
├── M4-Enhancements.md # Future enhancements
└── Payments.md        # Payment integration guide
```

## 🔧 Configuration

### Environment Variables

The application uses different environment files for different deployment scenarios:

#### Development (Docker)
- **File**: `settings.env` (used by `docker-compose.yml`)
- **Setup**: `cp env.example settings.env`
- **Database URL**: Automatically configured for Docker containers

#### Local Development
- **File**: `.env.local` (used by Next.js)
- **Setup**: `cp env.example .env.local`
- **Database URL**: Update to point to your local PostgreSQL

#### Production
- **File**: `.env.production` (used by `docker-compose.prod.yml`)
- **Setup**: `cp env.production.example .env.production`
- **Security**: Never commit this file to version control

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | `AIzaSy...` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Public Google Maps API key | `AIzaSy...` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` or `sk_live_...` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` or `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | `whsec_...` |
| `RESEND_API_KEY` | Email service API key | `re_...` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `secure_password` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `random_string` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `AC...` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `...` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | `+1234567890` |
| `DOMAIN` | Production domain | `yourdomain.com` |
| `ACME_EMAIL` | Email for SSL certificates | `admin@yourdomain.com` |

### Database

The application uses PostgreSQL with Prisma ORM. Key models:

- **Users**: Customer, admin, and driver accounts
- **Bookings**: Ride bookings with pricing and status
- **Payments**: Payment records linked to bookings

## 🚀 Development Workflow

1. **Code Style**: Prettier + ESLint
   ```bash
   npm run lint
   npm run format
   ```

2. **Database Changes**
   ```bash
   # After schema changes
   npx prisma migrate dev --name <migration-name>
   npx prisma generate
   ```

3. **Testing**
   ```bash
   npm run test
   ```

## 📋 Milestones

- **M0**: ✅ Setup and Foundations
- **M1**: 🚧 Booking MVP
- **M2**: 📋 Admin Basics
- **M3**: 📋 Customer Accounts
- **M4**: 📋 Enhancements

See `docs/` folder for detailed milestone documentation.

## 🐳 Deployment

### Docker Development

```bash
# Start all services (development)
docker-compose up --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Docker Production

1. **Setup production environment**
   ```bash
   # Copy production environment template
   cp env.production.example .env.production
   
   # Edit with your production values
   nano .env.production
   ```

2. **Deploy to production**
   ```bash
   # Deploy with production configuration
   docker-compose -f docker-compose.prod.yml --env-file .env.production up -d --build
   
   # View logs
   docker-compose -f docker-compose.prod.yml logs -f
   
   # Stop production services
   docker-compose -f docker-compose.prod.yml down
   ```

3. **Production features**
   - SSL/TLS termination via Traefik
   - Automatic HTTPS with Let's Encrypt
   - Health checks and auto-restart
   - Database migrations run automatically
   - Optimized multi-stage builds

### Manual Docker Build

```bash
# Build production image
docker build -t lgsfo:latest .

# Run with environment file
docker run -p 3000:3000 --env-file .env.production lgsfo:latest
```

### Apple Silicon Optimization

The Docker setup is optimized for Apple Silicon (M1/M2/M3/M4) with:
- Alpine Linux base images for smaller size
- Multi-stage builds for optimization
- Volume persistence for database
- Health checks for reliability

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| **app** | 3000 | Next.js application |
| **postgres** | 5432 | PostgreSQL database |
| **traefik** | 80, 443, 8080 | Reverse proxy and SSL termination |

### Health Monitoring

All services include health checks:
- **PostgreSQL**: `pg_isready` command
- **Application**: HTTP GET to `/api/health`
- **Traefik**: Built-in health monitoring

### Troubleshooting

```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]

# Reset everything (WARNING: deletes data)
docker-compose down -v
docker-compose up --build
```

For detailed Docker deployment instructions, see [README-Docker.md](README-Docker.md).

## 📚 Documentation

- [Project Overview](LETSGOSFO_README.md)
- [Docker Deployment Guide](README-Docker.md) - Comprehensive Docker setup and deployment
- [Development Guidelines](.cursorrules)
- [Milestone Documentation](docs/)
  - [M0: Setup and Foundations](docs/M0-Setup.md)
  - [M1: Booking MVP](docs/M1-Booking-MVP.md)
  - [M2: Admin Features](docs/M2-Admin.md)
  - [M3: Customer Accounts](docs/M3-Accounts.md)
  - [M4: Enhancements](docs/M4-Enhancements.md)
  - [Payments Integration](docs/Payments.md)

## 🔒 Security

### Environment Files

**IMPORTANT**: Never commit environment files with real credentials to version control.

- ✅ **Safe to commit**: `env.example`, `env.production.example`
- ❌ **Never commit**: `settings.env`, `.env.local`, `.env.production`

### API Keys

- Use test keys for development
- Rotate production keys regularly
- Use environment-specific configurations
- Monitor API usage and costs

### Database Security

- Use strong passwords for production
- Enable SSL connections in production
- Regular backups and testing
- Monitor database access logs

## 🤝 Contributing

1. Follow the coding standards in `.cursorrules`
2. Use conventional commits
3. Update documentation for new features
4. Test thoroughly before submitting
5. Never commit environment files with real credentials

## 📄 License

Private project - All rights reserved.
