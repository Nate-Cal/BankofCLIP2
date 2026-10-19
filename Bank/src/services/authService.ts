import type { Account, AuthService, User } from '../models/banking'
import { mockStore, ServiceError, simulateLatency } from './mockStore'

export { demoCredentials } from './mockStore'

export const authService: AuthService = {
  async login({ userId, pin }) {
    await simulateLatency()
    const user = mockStore.users.find(
      (candidate) =>
        candidate.userId.toLowerCase() === userId.trim().toLowerCase(),
    )
    if (!user || mockStore.credentials.get(user.id) !== pin) {
      throw new ServiceError(
        'INVALID_CREDENTIALS',
        'That user ID and PIN do not match. Please try again.',
      )
    }
    mockStore.currentUserId = user.id
    return { user: structuredClone(user) }
  },

  async register({ firstName, lastName, userId, pin }) {
    await simulateLatency()
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !userId.trim() ||
      !pin.trim()
    ) {
      throw new ServiceError(
        'VALIDATION_ERROR',
        'Please complete every required field.',
      )
    }
    if (
      mockStore.users.some(
        (user) => user.userId.toLowerCase() === userId.trim().toLowerCase(),
      )
    ) {
      throw new ServiceError(
        'USER_ID_TAKEN',
        'That user ID is already in use. Please choose another.',
      )
    }
    const id = crypto.randomUUID()
    const user: User = {
      id,
      userId: userId.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    }
    const accounts: Account[] = (['CHECKING', 'SAVINGS'] as const).map(
      (type, index) => ({
        id: crypto.randomUUID(),
        userId: id,
        type,
        name: type === 'CHECKING' ? 'Everyday Checking' : 'Personal Savings',
        lastFour: String(
          1000 + (((mockStore.accounts.length + index) * 137) % 9000),
        ),
        balanceCents: 0,
        currency: 'USD',
      }),
    )
    mockStore.users.push(user)
    mockStore.credentials.set(id, pin)
    mockStore.accounts.push(...accounts)
    // Registration returns to sign-in; it does not open a session.
    return { user: structuredClone(user) }
  },

  logout() {
    mockStore.currentUserId = null
  },
}
