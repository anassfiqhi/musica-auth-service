import type { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now()
  const requestId = Math.random().toString(36).substring(7)

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(
      {
        requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration: `${duration}ms`,
      },
      `${req.method} ${req.path} - ${res.statusCode}`
    )
  })

  next()
}
