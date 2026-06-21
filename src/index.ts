import 'dotenv/config'

import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth'
import cors from 'cors'
import { requestLoggerMiddleware } from './middleware/requestLogger'
import { errorHandlerMiddleware } from './middleware/errorHandler'
import { logger } from './utils/logger'

const PORT = parseInt(process.env.AUTH_SERVICE_PORT || '3005', 10)
const HOST = process.env.AUTH_SERVICE_HOST || '0.0.0.0'

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS?.split(',').map((origin) => origin.trim()) || ["*"])
logger.info("Origins allowed: %s", allowedOrigins)

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}))

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

app.all("/api/auth/*", toNodeHandler(auth)); // For ExpressJS v4
// app.all("/api/auth/*splat", toNodeHandler(auth)); For ExpressJS v5

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());
app.use(requestLoggerMiddleware)
app.use(errorHandlerMiddleware)

const displayHost = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.AUTH_SERVICE_HOST || HOST
const isLocalhost = displayHost === 'localhost' || displayHost === '0.0.0.0'

const logStartup = () => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const url = isLocalhost ? `${protocol}://${displayHost}:${PORT}` : `${protocol}://${displayHost}`
  logger.info(`✅ Auth service running on ${url}`)
  logger.info(`📚 API endpoints available at ${url}/api/auth/*`)
}

const server = app.listen(PORT, HOST, logStartup)

server.on('error', (err: any) => {
  if (err.code === 'EADDRNOTAVAIL') {
    app.listen(PORT, '0.0.0.0', logStartup)
  } else {
    throw err
  }
})