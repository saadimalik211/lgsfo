# LETSGOSFO

A premium ride booking platform for trips across the Greater Bay Area, with a focus on Marin ⇄ SFO routes. Built to be mobile-first, secure, and scalable.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### Local Development

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

### Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

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

Copy `env.example` to `.env.local` and configure:

- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_MAPS_API_KEY`: Google Maps API key
- `STRIPE_SECRET_KEY`: Stripe secret key (or Square credentials)
- `RESEND_API_KEY`: Email service API key
- `NEXTAUTH_SECRET`: Authentication secret

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

### Docker Production

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d

# Or build manually
docker build -t lgsfo .
docker run -p 3000:3000 lgsfo
```

### Apple Silicon Optimization

The Docker setup is optimized for Apple Silicon (M1/M2/M3/M4) with:
- Alpine Linux base images
- Multi-stage builds
- Volume persistence for database

## 📚 Documentation

- [Project Overview](LETSGOSFO_README.md)
- [Development Guidelines](.cursorrules)
- [Milestone Documentation](docs/)

## 🤝 Contributing

1. Follow the coding standards in `.cursorrules`
2. Use conventional commits
3. Update documentation for new features
4. Test thoroughly before submitting

## 📄 License

Private project - All rights reserved.
