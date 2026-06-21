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

app.all("/api/auth/*", toNodeHandler(auth)); // For ExpressJS v4
// app.all("/api/auth/*splat", toNodeHandler(auth)); For ExpressJS v5 

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());
app.use(requestLoggerMiddleware)
app.use(errorHandlerMiddleware)

app.listen(PORT, HOST, () => {
  logger.info(`✅ Auth service running on http://${HOST}:${PORT}`)
  logger.info(`📚 API endpoints available at http://${HOST}:${PORT}/api/auth/*`)
})