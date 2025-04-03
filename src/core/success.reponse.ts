import { Response } from 'express'

const StatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204
}

const ReasonCode = {
  OK: 'OK',
  CREATED: 'CREATED',
  NO_CONTENT: 'NO_CONTENT'
}

class SuccessResponse {
  message: string
  status: number
  metaData: Record<string, any>

  constructor({
    message,
    status = StatusCode.OK,
    reasonStatusCode = ReasonCode.OK,
    metaData = {}
  }: {
    message?: string
    status?: number
    reasonStatusCode?: string
    metaData?: Record<string, any>
  }) {
    this.message = !message ? reasonStatusCode : message
    this.status = status
    this.metaData = metaData
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this)
  }

  // Thêm phương thức static
  static send(
    res: Response,
    options: {
      message?: string
      status?: number
      reasonStatusCode?: string
      metaData?: Record<string, any>
      headers?: Record<string, string>
    }
  ) {
    const instance = new this(options)
    return instance.send(res, options.headers || {})
  }
}

class OK extends SuccessResponse {
  constructor({ message = ReasonCode.OK, metaData = {} }: { message?: string; metaData?: Record<string, any> }) {
    super({ message, metaData })
  }
}

class Created extends SuccessResponse {
  constructor({
    message,
    status = StatusCode.CREATED,
    reasonStatusCode = ReasonCode.CREATED,
    metaData = {}
  }: {
    message?: string
    status?: number
    reasonStatusCode?: string
    metaData?: Record<string, any>
  }) {
    super({ message, status, reasonStatusCode, metaData })
  }
}

export { Created, OK }
