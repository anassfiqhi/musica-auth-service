import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { jwt } from 'better-auth/plugins'
import { expo } from '@better-auth/expo'
import { db } from '../config/database'
import * as schema from '../db/schema'

/**
 * JWT authentication with httpOnly cookie storage
 * - Session strategy: JWT (stateless)
 * - Tokens stored in httpOnly cookies (more secure than Bearer tokens)
 * - Users stored in PostgreSQL only
 * - Supports Expo mobile apps, React web apps, and other services
 * - Multi-client compatible: all clients validate same JWT signature
 */
export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_BASE_URL ||
    (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : 'http://localhost:3005'),
  trustedOrigins: [
    // Web development
    'http://localhost:3000',
    'http://localhost:8081',
    'http://localhost:19006',
    'http://localhost:3005',
    // Mobile app (Expo) - matches scheme in app.json
    'musica://',
    'exp://*',
    'exp+musica://*',
    // Web production (add your domain when ready)
    // 'https://musica-web.example.com',
  ],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  session: {
    strategy: 'jwt',
    cookieCache: {
      enabled: true, // Store JWT in httpOnly cookies
    },
  },
  cookie: {
    httpOnly: true, // Prevent JS access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    path: '/',
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
    autoSignUpOnSignIn: false,
  },
  plugins: [
    expo(), // For Expo mobile app support (handles origin mapping for native clients)
    jwt(), // JWT token generation and verification
  ],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
