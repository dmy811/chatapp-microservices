export class HttpError extends Error {
  public readonly timestamp: string = new Date().toISOString()
  public readonly isOperational = true
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
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
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    }
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    code = 'BAD_REQUEST'
  ) {
    super(400, message, code, details)
  }
}

export class ConflictError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    code = 'CONFLICT'
  ) {
    super(409, message, code, details)
  }
}

export class ForbiddenError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    code = 'FORBIDDEN'
  ) {
    super(403, message, code, details)
  }
}

export class InternalServerError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    code = 'INTERNAL_SERVER_ERROR'
  ) {
    super(500, message, code, details)
  }
}

export class NotFoundError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    code = 'NOT_FOUND'
  ) {
    super(404, message, code, details)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(
    message: string,
    details?: Record<string, unknown>,
    code = 'UNAUTHORIZED'
  ) {
    super(401, message, code, details)
  }
}
