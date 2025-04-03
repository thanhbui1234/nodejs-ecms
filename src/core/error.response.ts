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
  BAD_REQUEST: 'BAD_REQUEST',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INTERNAL_SERVER: 'INTERNAL_SERVER'
}

class ErrorResponse extends Error {
  constructor(message: string = ReasonStatusCode.CONFLICT, status: number = statusCode.CONFLICT) {
    /// push message to Error
    super(message)
    ;(this as any).status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message: string, statusCode: number) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonStatusCode.CONFLICT, status: number = statusCode.CONFLICT) {
    super(message, status)
  }
}

export { BadRequestError, ConflictRequestError, statusCode }
