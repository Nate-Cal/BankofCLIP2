import type { AuthService } from '../models/banking'
import { apiRequest } from './apiClient'
import { apiRoutes } from './apiConfig'
import { mapUser, objectValue } from './apiMappers'
import { clearSession, startSession } from './authSession'
import { ServiceError } from './serviceError'

let authAttempt = 0

export const authService: AuthService = {
  async login({ userId, pin }) {
    const attempt = ++authAttempt
    clearSession()
    if (!userId.trim() || !pin.trim()) {
      throw new ServiceError('VALIDATION_ERROR', 'Enter your user ID and PIN.')
    }
    const response = objectValue(await apiRequest(apiRoutes.login, {
      method: 'POST', body: { email: userId.trim(), password: pin },
    }))
    if (attempt !== authAttempt) throw new ServiceError('SESSION_CHANGED', 'Sign-in was cancelled.')
    const user = mapUser(response)
    startSession(user, response.token)
    return { user }
  },

  async register({ firstName, lastName, userId, pin }) {
    const attempt = ++authAttempt
    clearSession()
    if (!firstName.trim() || !lastName.trim() || !userId.trim() || !pin.trim()) {
      throw new ServiceError('VALIDATION_ERROR', 'Please complete every required field.')
    }
    const response = await apiRequest(apiRoutes.register, {
      method: 'POST',
      body: {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: userId.trim(), password: pin,
      },
    })
    if (attempt !== authAttempt) throw new ServiceError('SESSION_CHANGED', 'Registration response was cancelled.')
    // The form returns to sign-in. Do not keep a token returned by registration.
    return { user: mapUser(response) }
  },

  logout() {
    ++authAttempt
    clearSession()
  },
}
