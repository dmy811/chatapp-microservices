export interface ServiceErrorRespose {
  success: false
  statusCode: number
  message: string
  errorCode: string
  details?: unknown
  timestamp: string
}

export class HttpError extends Error {
  public readonly timestamp: string = new Date().toISOString()
  public readonly isOperational = true
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorCode?: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype) // tanpa ini error instacneof HttpError bisa false
    Error.captureStackTrace(this, this.constructor) // agar stack bersih, tidak bocor contructor chain
  }

  serialize() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errorCode: this.errorCode,
      details: this.details,
      timestamp: this.timestamp
    }
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    errorCode = 'BAD_REQUEST'
  ) {
    super(400, message, errorCode, details)
  }
}

export class ConflictError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    errorCode = 'CONFLICT'
  ) {
    super(409, message, errorCode, details)
  }
}

export class ForbiddenError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    errorCode = 'FORBIDDEN'
  ) {
    super(403, message, errorCode, details)
  }
}

export class InternalServerError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    errorCode = 'INTERNAL_SERVER_ERROR'
  ) {
    super(500, message, errorCode, details)
  }
}

export class NotFoundError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    errorCode = 'NOT_FOUND'
  ) {
    super(404, message, errorCode, details)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    errorCode = 'UNAUTHORIZED'
  ) {
    super(401, message, errorCode, details)
  }
}
