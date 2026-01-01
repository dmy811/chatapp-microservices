import winston, { format, transports, Logger } from 'winston'

const NODE_ENV = process.env.NODE_ENV ?? 'development'
const defaultLevel =
  NODE_ENV === 'development'
    ? 'debug'
    : NODE_ENV === 'production'
      ? 'info'
      : 'debug'

const jsonFormat = format((info) => {
  const { from, level, message, timestamp, ...meta } = info

  const logObj: Record<string, any> = {
    from,
    message,
    level,
    timestamp,
    ...meta
  }

  info[Symbol.for('message')] = JSON.stringify(logObj, null, 2)
  return info
})

const consoleFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  jsonFormat(),
  format.colorize({ message: true })
)

export const createLogger = (service: string): Logger => {
  return winston.createLogger({
    level: defaultLevel,
    defaultMeta: { service: service },
    transports: [
      new transports.Console({
        format: consoleFormat
      })
    ],
    exitOnError: false
  })
}
