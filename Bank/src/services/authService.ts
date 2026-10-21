import type {
  AuthResponse,
  AuthService,
  LoginRequest,
  RegistrationRequest,
  User,
} from '../models/banking'
import {
  apiRequest,
  clearAuthToken,
  saveAuthToken,
} from './apiClient'

interface BackendAuthResponse {
  userId: string
  name: string
  email: string
  token: string
}

function mapUser(response: BackendAuthResponse): User {
  const nameParts = (response.name || '').trim().split(/\s+/)

  return {
    id: String(response.userId),
    userId: response.email,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' '),
  }
}

function mapAuthResponse(
  response: BackendAuthResponse,
): AuthResponse {
  if (!response.token) {
    throw new Error('The server did not return an authentication token.')
  }

  saveAuthToken(response.token)

  const user = mapUser(response)
  localStorage.setItem('bankCurrentUser', JSON.stringify(user))

  return { user }
}

export const authService: AuthService = {
  async login({ email, password }: LoginRequest) {
    const response = await apiRequest<BackendAuthResponse>(
      '/user/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      },
    )

    return mapAuthResponse(response)
  },

  async register({ name, email, password }: RegistrationRequest) {
    const response = await apiRequest<BackendAuthResponse>(
      '/user/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      },
    )

    // Registration creates the account but does not automatically
    // open a frontend session.
    return { user: mapUser(response) }
  },

  logout() {
    clearAuthToken()
    localStorage.removeItem('bankCurrentUser')
  },
}
