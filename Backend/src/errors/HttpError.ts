export interface HttpError {
  status: number
  message: string
  details?: string[]
}

export class AppError extends Error implements HttpError {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: string[],
  ) {
    super(message)
    this.name = new.target.name
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: string[]) {
    super(message, 400, details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500)
  }
}

export class ValidationError extends BadRequestError {
  constructor(details: string[]) {
    super('Validation failed', details)
  }
}

export function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status?: unknown }).status === 'number'
  )
}
