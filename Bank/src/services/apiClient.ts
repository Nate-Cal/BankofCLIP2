import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './apiConfig'
import { assertCurrentSession, clearSession, getSession, requireSession } from './authSession'
import type { AuthSession } from './authSession'
import { ServiceError } from './serviceError'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT'
  body?: unknown
  authenticated?: boolean
  session?: AuthSession
  responseType?: 'json' | 'text'
}

function responseError(text: string, status: number): ServiceError {
  let code = `HTTP_${status}`
  let message = `The server could not complete the request (${status}).`
  try {
    const body: unknown = JSON.parse(text)
    if (body && typeof body === 'object') {
      if ('code' in body && typeof body.code === 'string') code = body.code
      if ('message' in body && typeof body.message === 'string') message = body.message
    }
  } catch {
    // A short plain-text API error is useful; an HTML error page is not.
    if (text.trim() && !text.includes('<') && text.length < 500) message = text.trim()
  }
  return new ServiceError(code, message, status)
}

/** Single HTTP boundary: bearer headers, JSON, errors and timeouts; never retries mutations. */
export async function apiRequest(endpoint: string, options: RequestOptions = {}): Promise<unknown> {
  const current = options.authenticated ? (options.session ?? requireSession()) : null
  if (current) assertCurrentSession(current)
  const headers = new Headers({ Accept: 'application/json, text/plain' })
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  if (current) headers.set('Authorization', `Bearer ${current.token}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
    })
    const text = await response.text()
    if (current) assertCurrentSession(current)
    if (!response.ok) {
      if (response.status === 401 && current && getSession() === current) {
        clearSession('expired')
        throw new ServiceError('UNAUTHENTICATED', 'Your session expired. Please sign in again.', 401)
      }
      throw responseError(text, response.status)
    }
    if (options.responseType === 'text') {
      // Java controllers can return text/plain or a JSON-encoded string.
      try {
        const decoded: unknown = JSON.parse(text)
        if (typeof decoded === 'string') return decoded
      } catch { /* Plain text is the expected response for the existing mutation routes. */ }
      return text.trim()
    }
    try { return JSON.parse(text) as unknown }
    catch { throw new ServiceError('INVALID_API_RESPONSE', 'The server returned an invalid JSON response.', response.status) }
  } catch (error) {
    if (error instanceof ServiceError) throw error
    if (controller.signal.aborted) {
      throw new ServiceError('REQUEST_TIMEOUT', 'The server took too long to respond.')
    }
    throw new ServiceError('NETWORK_ERROR', 'Could not reach the bank server. Check that it is running and allows this app to connect.')
  } finally { clearTimeout(timer) }
}
