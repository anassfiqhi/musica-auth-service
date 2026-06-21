import pino from 'pino'

const isDev = process.env.NODE_ENV === 'development'
const logLevel = process.env.LOG_LEVEL || 'info'

export const logger = pino(
  {
    level: logLevel,
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() }
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  isDev ? pino.transport({ target: 'pino-pretty' }) : undefined
)
