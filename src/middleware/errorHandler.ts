import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      name: err.name,
    },
    `Unhandled error occurred`
  )

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
}
