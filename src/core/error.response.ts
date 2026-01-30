const statusCode = {
  CONFLICT: 409,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER: 500
}

const ReasonStatusCode = {
  CONFLICT: 'CONFLICT ERROR',
  BAD_REQUEST: 'BAD_REQUEST ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_SERVER: 'INTERNAL_SERVER'
}

class ErrorResponse extends Error {
  constructor(message: string = ReasonStatusCode.BAD_REQUEST, status: number = statusCode.BAD_REQUEST) {
    /// push message to Error
    super(message)
    ;(this as any).status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.CONFLICT, status: number = statusCode.FORBIDDEN) {
    super(message, status)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.BAD_REQUEST, status: number = statusCode.BAD_REQUEST) {
    super(message, status)
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.UNAUTHORIZED, status: number = statusCode.UNAUTHORIZED) {
    super(message, status)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.NOT_FOUND, status: number = statusCode.NOT_FOUND) {
    super(message, status)
  }
}
export { BadRequestError, ConflictRequestError, statusCode, UnauthorizedError, NotFoundError }
