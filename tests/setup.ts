import { vi, beforeEach } from 'vitest'

// Set environment variables for tests before any modules are imported
process.env.BETTER_AUTH_SECRET = 'test-secret-key-at-least-32-characters-long'
process.env.BETTER_AUTH_URL = 'http://localhost:8000'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'
process.env.AUTH_SERVICE_PORT = '3005'
process.env.AUTH_SERVICE_HOST = '0.0.0.0'
process.env.NODE_ENV = 'test'

// Clear all mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})
