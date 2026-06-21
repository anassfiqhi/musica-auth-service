import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { bearer, jwt } from 'better-auth/plugins'
import { db } from '../config/database'
import * as schema from '../db/schema'

/**
 * JWT-only authentication
 * - Session strategy: JWT (stateless)
 * - No database sessions stored
 * - Users stored in PostgreSQL only
 * - JWT tokens for all API calls
 */
export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_BASE_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:8000'),
  trustedOrigins: [
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:8000',
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  session: {
    strategy: 'jwt',
    cookieCache: {
      enabled: false,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    autoSignUpOnSignIn: false,
  },
  plugins: [
    bearer(), // For Bearer token support
    jwt(), // JWT token generation
  ],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
