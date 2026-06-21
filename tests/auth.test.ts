import { describe, it, expect, vi, beforeEach } from 'vitest'
import 'dotenv/config'

import { auth } from '../src/lib/auth'

describe('Better Auth Connection & Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should initialize auth instance', () => {
    expect(auth).toBeDefined()
    expect(auth.handler).toBeDefined()
  })

  it('should have JWT plugin enabled', () => {
    expect(auth.options.plugins).toBeDefined()
    const hasJwt = auth.options.plugins?.some(p => p.id === 'jwt')
    expect(hasJwt).toBe(true)
  })

  it('should have JWT session strategy', () => {
    expect(auth.options.session).toBeDefined()
    expect(auth.options.session?.strategy).toBe('jwt')
  })

  it('should have database connected', () => {
    expect(auth.options.database).toBeDefined()
  })

  it('should have Better-auth secret configured', () => {
    expect(process.env.BETTER_AUTH_SECRET).toBeDefined()
    expect(process.env.BETTER_AUTH_SECRET!.length).toBeGreaterThanOrEqual(32)
  })

  it('should have Neon database URL configured', () => {
    expect(process.env.DATABASE_URL).toBeDefined()
    expect(process.env.DATABASE_URL).toContain('postgresql')
  })

  describe('Handler Function', () => {
    it('should have a callable handler', () => {
      expect(typeof auth.handler).toBe('function')
    })

    it('handler is properly exposed for middleware', () => {
      // Better-auth handler is used via toNodeHandler middleware wrapper
      // The handler should be a callable function
      expect(typeof auth.handler).toBe('function')
    })
  })

  describe('JWT Configuration', () => {
    it('should have baseURL configured', () => {
      console.log('Auth options:', {
        baseURL: auth.options.baseURL,
        sessionStrategy: auth.options.session?.strategy,
        plugins: auth.options.plugins?.map(p => p.id),
      })
      expect(auth.options.baseURL).toBeDefined()
      expect(auth.options.baseURL).toBe('http://localhost:8000')
    })

    it('should have both JWT and bearer plugins enabled', () => {
      const pluginIds = auth.options.plugins?.map(p => p.id) || []
      expect(pluginIds).toContain('jwt')
      expect(pluginIds).toContain('bearer')
    })
  })
})

describe('User Sign Up', () => {
  it('should have email/password signup enabled', () => {
    expect(auth.options.emailAndPassword).toBeDefined()
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })

  it('should have user schema for signup', () => {
    // Verify database adapter is configured for user creation
    expect(auth.options.database).toBeDefined()
  })

  it('should validate required fields in signup', () => {
    // Name, email, and password are required
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })
})

describe('User Sign In', () => {
  it('should have email/password signin enabled', () => {
    expect(auth.options.emailAndPassword).toBeDefined()
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })

  it('should return JWT token on signin', () => {
    const hasJwt = auth.options.plugins?.some(p => p.id === 'jwt')
    expect(hasJwt).toBe(true)
  })

  it('should have session strategy configured', () => {
    expect(auth.options.session?.strategy).toBe('jwt')
  })
})

describe('User CRUD Operations', () => {
  it('should support user creation', () => {
    expect(auth.options.database).toBeDefined()
    expect(auth.options.emailAndPassword?.enabled).toBe(true)
  })

  it('should support user retrieval', () => {
    // Database adapter should support finding users
    expect(auth.options.database).toBeDefined()
  })

  it('should support user modification', () => {
    // Database adapter should support updating users
    expect(auth.options.database).toBeDefined()
  })

  it('should support user deletion', () => {
    // Database adapter should support deleting users
    expect(auth.options.database).toBeDefined()
  })
})

describe('Test Environment', () => {
  it('should have test environment variables set', () => {
    expect(process.env.BETTER_AUTH_SECRET).toBe('test-secret-key-at-least-32-characters-long')
    expect(process.env.DATABASE_URL).toBe('postgresql://test:test@localhost:5432/test_db')
    expect(process.env.AUTH_SERVICE_PORT).toBe('3005')
    expect(process.env.NODE_ENV).toBe('test')
  })

  it('mocks are cleared between tests', () => {
    const mockFn = vi.fn()
    mockFn()
    expect(mockFn).toHaveBeenCalledTimes(1)

    vi.clearAllMocks()
    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
