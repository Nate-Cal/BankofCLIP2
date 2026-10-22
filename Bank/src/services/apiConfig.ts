// Public configuration only. Never put a JWT signing secret or database password here.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
).replace(/\/+$/, '')

// Matches the HTTP routes included in the supplied repository history.
export const apiRoutes = {
  login: '/user/login',
  register: '/user/register',
  accounts: '/user/accounts',
  history: (id: string) => `/transaction/transactions/${encodeURIComponent(id)}`,
  deposit: (id: string) => `/transaction/deposit/${encodeURIComponent(id)}`,
  withdraw: (id: string) => `/transaction/withdraw/${encodeURIComponent(id)}`,
  transfer: (id: string) => `/transaction/transfer/${encodeURIComponent(id)}`,
}

export const REQUEST_TIMEOUT_MS = 15_000
