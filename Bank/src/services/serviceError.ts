import type { ApiError } from '../models/banking'

export class ServiceError extends Error implements ApiError {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status = 0) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
    this.status = status
  }
}
