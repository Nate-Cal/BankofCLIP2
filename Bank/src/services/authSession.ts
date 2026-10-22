import type { User } from '../models/banking'
import { ServiceError } from './serviceError'

export interface AuthSession {
  readonly user: Readonly<User>
  readonly token: string
  readonly expiresAt: number
}

type EndReason = 'logout' | 'expired'
let session: AuthSession | null = null
let expiryTimer: ReturnType<typeof setTimeout> | undefined
const listeners = new Set<(reason: EndReason) => void>()

export function clearSession(reason: EndReason = 'logout'): void {
  const hadSession = session !== null
  session = null
  clearTimeout(expiryTimer)
  expiryTimer = undefined
  if (hadSession) listeners.forEach((listener) => listener(reason))
}

export function onSessionEnded(listener: (reason: EndReason) => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getSession(): AuthSession | null {
  if (session && session.expiresAt <= Date.now()) clearSession('expired')
  return session
}

export function requireSession(): AuthSession {
  const current = getSession()
  if (!current) throw new ServiceError('UNAUTHENTICATED', 'Please sign in to continue.', 401)
  return current
}

export function assertCurrentSession(expected: AuthSession): void {
  if (getSession() !== expected) {
    throw new ServiceError('SESSION_CHANGED', 'Your session changed. Please sign in again.', 401)
  }
}

/** Decode expiry for client UX only. Signature/issuer/authorization are verified by the API. */
export function startSession(user: User, token: unknown): void {
  let expiresAt: number
  try {
    if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) throw new Error()
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const claims: unknown = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')))
    if (!claims || typeof claims !== 'object' || !('exp' in claims)
      || typeof claims.exp !== 'number' || !Number.isSafeInteger(claims.exp)) throw new Error()
    expiresAt = claims.exp * 1000
    if (!Number.isSafeInteger(expiresAt) || expiresAt <= Date.now()) throw new Error()
  } catch {
    throw new ServiceError('INVALID_AUTH_RESPONSE', 'The server did not return a usable, unexpired JWT.')
  }

  clearTimeout(expiryTimer)
  session = Object.freeze({ user: Object.freeze({ ...user }), token: token as string, expiresAt })
  function scheduleExpiry() {
    if (!session) return
    const remaining = session.expiresAt - Date.now()
    if (remaining <= 0) { clearSession('expired'); return }
    expiryTimer = setTimeout(scheduleExpiry, Math.min(remaining, 2_147_483_647))
  }
  scheduleExpiry()
}
