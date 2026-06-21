# Musica Auth Service

Centralized authentication service for MusicaApp using Better-auth, Drizzle ORM, and PostgreSQL.

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
# Edit .env with your database URL
```

### 2. Start PostgreSQL (Local Development)

For **local development**, use Docker:
```bash
docker-compose up -d
```

Then update `.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/musica_auth
```

For **production**, use Neon (already configured in `.env`):
```
DATABASE_URL=postgresql://neondb_owner:...@....aws.neon.tech/neondb?sslmode=require
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Initialize Neon Database (Fresh Start)

Clear the database and prepare for Better-auth schema:
```bash
pnpm db:init
```

This will:
- Drop existing tables if any
- Clear verification, session, account, user tables
- Prepare database for Better-auth to create fresh schema

### 5. Generate & Run Migrations

```bash
# Generate schema from database
pnpm db:generate

# Push schema to database
pnpm db:push
```

### 5. Start Development Server

```bash
pnpm dev
```

Server runs at `http://localhost:8000`

## Available Commands

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Run production build

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio GUI

# Testing & Linting
pnpm test             # Run tests with Vitest
pnpm test:ui          # Run tests with UI
pnpm lint             # Type check with TypeScript
```

## API Endpoints

All auth endpoints are at `/api/auth/*`:

- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login (returns session + JWT in header)
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session (returns JWT in header)
- `POST /api/auth/token` - Get JWT token for external services (SpotiFLAC, Sunnify)
- `GET /health` - Health check

### JWT for External Services

Better-auth uses a **hybrid approach**:
- **Sessions**: Stored in PostgreSQL, used internally for state management
- **JWT tokens**: Returned in `set-auth-jwt` header or via `/api/auth/token` endpoint
- **Expiration**: JWTs expire in 1 hour, but sessions last 7 days (auto-refresh)
- **Use**: SpotiFLAC and Sunnify receive JWT tokens in `Authorization: Bearer <token>` header

Example flow:
```
1. Frontend: POST /api/auth/sign-in
2. Response headers include: set-auth-jwt: <token>
3. Frontend: Forward JWT to SpotiFLAC: GET /api/search 
   Header: Authorization: Bearer <token>
4. SpotiFLAC validates token locally
```

## Project Structure

```
src/
├── config/           # Configuration (database, env)
├── db/               # Database schema (auto-generated)
├── lib/              # Core libraries (Better-auth)
├── middleware/       # Express middleware
├── utils/            # Utilities (logger, validators)
├── app.ts            # Express app setup
└── index.ts          # Entry point

drizzle/
└── migrations/       # Auto-generated migrations
```

## Technology Stack

- **Framework**: Express.js
- **Auth**: Better-auth (with email/password)
- **Database**: PostgreSQL (Neon for production)
- **ORM**: Drizzle ORM
- **Language**: TypeScript
- **Logging**: Pino
- **Testing**: Vitest + Supertest
- **Package Manager**: pnpm

## Environment Variables

See `.env.example` for all available options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth secret (generate with `openssl rand -hex 16`)
- `BETTER_AUTH_URL` - Service URL
- `NODE_ENV` - development or production
- `LOG_LEVEL` - debug, info, warn, error

## Development Notes

- Uses Pino for structured logging
- Request logging middleware with duration tracking
- Error handling middleware with proper status codes
- CORS configured for frontend URLs
- Type-safe with TypeScript strict mode

## Next Steps

1. ✅ Local development setup complete
2. ⏳ Phase 2: Add auth middleware to SpotiFLAC (Go)
3. ⏳ Phase 3: Add auth middleware to Sunnify (Python)
4. ⏳ Phase 4: Integrate with React Native frontend
