import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authService } from '../src/services/authService'
import { bankService } from '../src/services/bankService'
import { apiRequest } from '../src/services/apiClient'
import { API_BASE_URL } from '../src/services/apiConfig'
import { getSession, onSessionEnded, startSession } from '../src/services/authSession'
import { centsToDollars, dollarsToCents, mapAccounts, mapTransactions } from '../src/services/apiMappers'

const user = { id: '7', userId: 'eric@example.com', email: 'eric@example.com', firstName: 'Eric', lastName: 'Example' }
const token = (expiry = Math.floor(Date.now() / 1000) + 3600) =>
  `e30.${Buffer.from(JSON.stringify({ sub: 'eric@example.com', userId: 7, role: 'USER', iss: 'bankofcli', exp: expiry })).toString('base64url')}.c2lnbmF0dXJl`
const authBody = () => ({ userId: 7, firstName: 'Eric', lastName: 'Example', email: 'eric@example.com', token: token() })
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
})
const accounts = (balance = 100) => [
  { accountId: 11, user: { userId: 7, password: 'must-never-be-cached' }, currencyType: 'USD', accountBalance: balance },
  { accountId: 12, user: { userId: 7 }, currencyType: 'USD', accountBalance: 20, type: 'SAVINGS', name: 'Savings' },
]
const history = (id = 1, type = 'DEPOSIT', accountId = 11, amount = '10.00') => ({
  transactionId: id, account: { accountId }, type, amount,
  date: '2026-10-22T14:00:00.000Z', description: '',
})
let fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  authService.logout()
  fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => {
  authService.logout()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('authentication and HTTP requests', () => {
  it('reads the SecurityConfig error field without hiding the server message', async () => {
    fetchMock.mockResolvedValueOnce(json({ error: 'Invalid email or password' }, 401))
    await expect(authService.login({ email: 'eric@example.com', password: 'incorrect' }))
      .rejects.toMatchObject({ message: 'Invalid email or password', status: 401 })
    expect(getSession()).toBeNull()
  })

  it('requires the new auth response fields instead of storing an undefined ID', async () => {
    for (const missing of ['userId', 'firstName', 'lastName', 'email']) {
      const response: Record<string, unknown> = authBody()
      delete response[missing]
      fetchMock.mockResolvedValueOnce(json(response))
      await expect(authService.login({ email: 'eric@example.com', password: 'password' }))
        .rejects.toMatchObject({ code: 'INVALID_API_RESPONSE' })
      expect(getSession()).toBeNull()
    }
  })

  it('accepts registration without a JWT and preserves the new split-name payload', async () => {
    fetchMock.mockResolvedValueOnce(json({ ...authBody(), token: undefined }, 201))
    expect(await authService.register({ firstName: 'Eric', lastName: 'Example', email: 'eric@example.com', password: ' pass word ' }))
      .toEqual({ user })
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      firstName: 'Eric', lastName: 'Example', email: 'eric@example.com', password: ' pass word ',
    })
    expect(getSession()).toBeNull()
  })

  it('retains the session on a role-based 403 and exposes the backend error', async () => {
    startSession(user, token())
    fetchMock.mockResolvedValueOnce(json({ error: 'Access denied' }, 403))
    await expect(apiRequest('/user/accounts', { authenticated: true }))
      .rejects.toMatchObject({ status: 403, message: 'Access denied' })
    expect(getSession()?.user.id).toBe(user.id)
  })

  it('maps the existing login form to the API and uses the real response id', async () => {
    const storageWrite = vi.fn()
    vi.stubGlobal('localStorage', { setItem: storageWrite })
    vi.stubGlobal('sessionStorage', { setItem: storageWrite })
    fetchMock.mockResolvedValueOnce(json(authBody()))
    expect(await authService.login({ email: ' eric@example.com ', password: ' my PIN ' })).toEqual({ user })
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe(`${API_BASE_URL}/auth`)
    expect(options?.method).toBe('POST')
    expect(JSON.parse(options?.body as string)).toEqual({ email: 'eric@example.com', password: ' my PIN ' })
    expect(new Headers(options?.headers).has('Authorization')).toBe(false)
    expect(getSession()?.user.id).toBe('7')
    expect(storageWrite).not.toHaveBeenCalled()
  })

  it('registers over HTTP and returns to sign-in without keeping the registration token', async () => {
    fetchMock.mockResolvedValueOnce(json(authBody(), 201))
    const result = await authService.register({ firstName: ' Eric ', lastName: ' Example ', email: ' eric@example.com ', password: 'pin' })
    expect(result.user).toEqual(user)
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({ firstName: 'Eric', lastName: 'Example', email: 'eric@example.com', password: 'pin' })
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE_URL}/auth/register`)
    expect(getSession()).toBeNull()
  })

  it('preserves API validation messages and does not retain a failed login session', async () => {
    fetchMock.mockResolvedValueOnce(json({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials.' }, 401))
    await expect(authService.login({ email: 'eric@example.com', password: 'bad' })).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', status: 401 })
    expect(getSession()).toBeNull()
  })

  it('rejects malformed or expired JWTs before starting a session', async () => {
    for (const value of ['bad-token', token(Math.floor(Date.now() / 1000) - 1)]) {
      fetchMock.mockResolvedValueOnce(json({ ...authBody(), token: value }))
      await expect(authService.login({ email: 'eric@example.com', password: 'pin' })).rejects.toMatchObject({ code: 'INVALID_AUTH_RESPONSE' })
      expect(getSession()).toBeNull()
    }
  })

  it('attaches a bearer header only to authenticated requests and clears it on logout', async () => {
    startSession(user, token())
    const jwt = getSession()!.token
    fetchMock.mockResolvedValueOnce(json([]))
    await apiRequest('/user/accounts', { authenticated: true })
    expect(new Headers(fetchMock.mock.calls[0][1]?.headers).get('Authorization')).toBe(`Bearer ${jwt}`)
    expect(fetchMock.mock.calls[0][1]?.credentials).toBe('omit')
    authService.logout()
    await expect(bankService.getDashboard()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('notifies the React app and clears the session when a protected request returns 401', async () => {
    startSession(user, token())
    const listener = vi.fn()
    const unsubscribe = onSessionEnded(listener)
    try {
      fetchMock.mockResolvedValueOnce(json({ message: 'Expired' }, 401))
      await expect(bankService.getDashboard()).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
      expect(getSession()).toBeNull()
      expect(listener).toHaveBeenCalledWith('expired')
    } finally { unsubscribe() }
  })

  it('expires an idle session without waiting for another request', async () => {
    vi.useFakeTimers()
    const listener = vi.fn()
    const unsubscribe = onSessionEnded(listener)
    try {
      startSession(user, token(Math.floor(Date.now() / 1000) + 2))
      await vi.advanceTimersByTimeAsync(2100)
      expect(getSession()).toBeNull()
      expect(listener).toHaveBeenCalledWith('expired')
    } finally { unsubscribe() }
  })

  it('does not clear a new login when an older request finishes with 401', async () => {
    startSession(user, token())
    let finish!: (value: Response) => void
    fetchMock.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve }))
    const oldRequest = apiRequest('/user/accounts', { authenticated: true })
    startSession({ ...user, id: '8' }, token())
    finish(json({ message: 'Old session expired' }, 401))
    await expect(oldRequest).rejects.toMatchObject({ code: 'SESSION_CHANGED' })
    expect(getSession()?.user.id).toBe('8')
  })

  it('does not restore a session when logout happens during login', async () => {
    let finish!: (value: Response) => void
    fetchMock.mockImplementationOnce(() => new Promise((resolve) => { finish = resolve }))
    const login = authService.login({ email: 'eric@example.com', password: 'pin' })
    authService.logout()
    finish(json(authBody()))
    await expect(login).rejects.toMatchObject({ code: 'SESSION_CHANGED' })
    expect(getSession()).toBeNull()
  })

  it('rejects HTML or empty successful responses instead of inventing data', async () => {
    fetchMock.mockResolvedValueOnce(new Response('<html>Sign in</html>'))
    await expect(apiRequest('/auth')).rejects.toMatchObject({ code: 'INVALID_API_RESPONSE' })
  })

  it('handles network errors and aborts a timed-out request', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(apiRequest('/user/accounts')).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
    vi.useFakeTimers()
    fetchMock.mockImplementationOnce((_url, options) => new Promise((_resolve, reject) => {
      options!.signal!.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    }))
    const assertion = expect(apiRequest('/user/accounts')).rejects.toMatchObject({ code: 'REQUEST_TIMEOUT' })
    await vi.advanceTimersByTimeAsync(15_000)
    await assertion
  })
})

describe('bank API mapping and transactions', () => {
  beforeEach(() => { startSession(user, token()) })

  it('maps the checked-in BankofCLI account and transaction model fields with UUID IDs', async () => {
    const ownerId = '1187a977-dd67-4e78-9476-bf9eb48d3a24'
    const accountId = '6498683a-6109-468f-8337-4ccb52d2bf80'
    startSession({ ...user, id: ownerId }, token())
    fetchMock.mockResolvedValueOnce(json([{
      id: accountId, ownerId, name: 'Everyday checking', balance: 123.45, currency: 'USD', mask: '****4321',
    }])).mockResolvedValueOnce(json([{
      id: 'tx-uuid', accountId, type: 'WITHDRAW', amount: 1.25,
      date: '2026-10-22T14:00:00.000Z', description: 'Withdrawal',
    }]))
    const result = await bankService.getDashboard()
    expect(result.accounts[0]).toMatchObject({ id: accountId, userId: ownerId, name: 'Everyday checking', balanceCents: 12345, lastFour: '4321' })
    expect(result.transactions[0]).toMatchObject({ id: 'tx-uuid', accountId, type: 'WITHDRAWAL', direction: 'DEBIT', amountCents: 125 })
    expect(result.transactions[0].timestamp).toBe(result.transactions[0].createdAt)
  })

  it('rejects mismatched owners and missing balances in the current model shape', () => {
    expect(() => mapAccounts([{ id: 'account', ownerId: 'another-user', balance: 10, currency: 'USD' }], '7')).toThrow()
    expect(() => mapAccounts([{ id: 'account', ownerId: '7', currency: 'USD' }], '7')).toThrow()
    expect(mapAccounts([{ id: 'account', ownerId: '7', balance: 0, currency: 'USD' }], '7')[0].balanceCents).toBe(0)
  })

  it.each(['empty', 'json'])('accepts a %s mutation acknowledgement and refreshes server data', async (kind) => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(kind === 'empty' ? new Response(null, { status: 204 }) : json({ success: true }))
      .mockResolvedValueOnce(json(accounts(101)))
      .mockResolvedValueOnce(json([history(42, 'DEPOSIT', 11, '1.00')]))
      .mockResolvedValueOnce(json([]))
    const result = await bankService.submitTransaction({ type: 'DEPOSIT', accountId: '11', amountCents: 100 })
    expect(result.accounts[0].balanceCents).toBe(10100)
    expect(result.transactions[0].id).toBe('42')
  })

  it('rejects a JSON business error even when the controller returns HTTP 200', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts())).mockResolvedValueOnce(json({ error: 'Insufficient funds' }))
    await expect(bankService.submitTransaction({ type: 'WITHDRAWAL', accountId: '11', amountCents: 100 }))
      .rejects.toMatchObject({ code: 'TRANSACTION_REJECTED', message: 'Insufficient funds' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('loads real account/history responses, converts dollars to cents and discards private fields', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(json([history()]))
      .mockResolvedValueOnce(json([history(2, 'TRANSFER_IN', 12, '2.00')]))
    const dashboard = await bankService.getDashboard()
    expect(dashboard.accounts[0].balanceCents).toBe(10_000)
    expect(dashboard.accounts[1].type).toBe('SAVINGS')
    expect(dashboard.transactions.find((item) => item.id === '2')).toMatchObject({ type: 'TRANSFER', direction: 'CREDIT', accountId: '12' })
    expect(JSON.stringify(dashboard)).not.toContain('must-never-be-cached')
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      `${API_BASE_URL}/user/accounts`, `${API_BASE_URL}/transaction/transactions/11`, `${API_BASE_URL}/transaction/transactions/12`,
    ])
  })

  it('returns an empty dashboard when the server has no accounts', async () => {
    fetchMock.mockResolvedValueOnce(json([]))
    expect(await bankService.getDashboard()).toEqual({ user, accounts: [], transactions: [] })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('does not silently substitute zero for missing/invalid money', async () => {
    for (const invalid of [undefined, null, 'bad', -1, '0.001', Infinity, 1.234]) {
      expect(() => dollarsToCents(invalid)).toThrow()
    }
    expect(dollarsToCents(0.1 + 0.2)).toBe(30)
    expect(dollarsToCents('123.40')).toBe(12340)
    expect(centsToDollars(Number.MAX_SAFE_INTEGER)).toBe('90071992547409.91')
    fetchMock.mockResolvedValueOnce(json([{ ...accounts()[0], accountBalance: undefined }]))
    await expect(bankService.getDashboard()).rejects.toMatchObject({ code: 'INVALID_API_RESPONSE' })
  })

  it('normalizes legacy transfer labels and rejects missing directions or invalid dates', () => {
    expect(mapTransactions([history(1, 'TRANSFER/WITHDRAWAL')], '11')[0]).toMatchObject({ type: 'TRANSFER', direction: 'DEBIT' })
    expect(mapTransactions([history(2, 'TRANSFER/DEPOSIT')], '11')[0]).toMatchObject({ type: 'TRANSFER', direction: 'CREDIT' })
    expect(() => mapTransactions([history(3, 'TRANSFER')], '11')).toThrow()
    expect(() => mapTransactions([{ ...history(), date: 'invalid' }], '11')).toThrow()
    expect(() => mapTransactions([history(4, 'UNKNOWN')], '11')).toThrow()
  })

  it('submits the exact amount and returns one authoritative history snapshot', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(new Response('Deposit of $0.29 was successful. Thank you for banking with us.'))
      .mockResolvedValueOnce(json(accounts(100.29)))
      .mockResolvedValueOnce(json([history(), history(3, 'DEPOSIT', 11, '0.29')]))
      .mockResolvedValueOnce(json([]))
    const result = await bankService.submitTransaction({ type: 'DEPOSIT', accountId: '11', amountCents: 29 })
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/transaction/deposit/11?amount=0.29`)
    expect(fetchMock.mock.calls[1][1]?.method).toBe('PUT')
    expect(result.accounts[0].balanceCents).toBe(10029)
    expect(result.transactions).toHaveLength(2)
    expect(new Set(result.transactions.map((item) => item.id)).size).toBe(2)
  })

  it('uses the withdraw route and accepts JSON-encoded success text', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(json('Withdrawal of $25.00 was successful.'))
      .mockResolvedValueOnce(json(accounts(75)))
      .mockResolvedValueOnce(json([history(3, 'WITHDRAWAL', 11, '25.00')]))
      .mockResolvedValueOnce(json([]))
    const result = await bankService.submitTransaction({ type: 'WITHDRAWAL', accountId: '11', amountCents: 2500 })
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/transaction/withdraw/11?amount=25.00`)
    expect(result.transactions[0].direction).toBe('DEBIT')
  })

  it('submits a transfer with the correct source, destination and amount', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(new Response('transfer was successful'))
      .mockResolvedValueOnce(json(accounts(75)))
      .mockResolvedValueOnce(json([history(5, 'TRANSFER_OUT', 11, '25.00')]))
      .mockResolvedValueOnce(json([history(6, 'TRANSFER_IN', 12, '25.00')]))
    const result = await bankService.submitTransaction({ type: 'TRANSFER', accountId: '11', destinationAccountId: '12', amountCents: 2500 })
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE_URL}/transaction/transfer/11?amount=25.00&transferAccountId=12`)
    expect(result.transactions.filter((item) => item.direction === 'CREDIT')[0].accountId).toBe('12')
  })

  it('rejects invalid amounts, same-account transfers and unsupported notes before calling the API', async () => {
    for (const amountCents of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
      await expect(bankService.submitTransaction({ type: 'DEPOSIT', accountId: '11', amountCents })).rejects.toMatchObject({ code: 'INVALID_AMOUNT' })
    }
    await expect(bankService.submitTransaction({ type: 'TRANSFER', accountId: '11', destinationAccountId: '11', amountCents: 1 })).rejects.toMatchObject({ code: 'INVALID_DESTINATION' })
    await expect(bankService.submitTransaction({ type: 'DEPOSIT', accountId: '11', amountCents: 1, note: 'Do not drop me' })).rejects.toMatchObject({ code: 'NOTES_NOT_SUPPORTED' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('checks account membership and available balance before sending a mutation', async () => {
    fetchMock.mockImplementation(async () => json(accounts()))
    await expect(bankService.submitTransaction({ type: 'DEPOSIT', accountId: '99', amountCents: 1 })).rejects.toMatchObject({ code: 'ACCOUNT_NOT_FOUND' })
    await expect(bankService.submitTransaction({ type: 'WITHDRAWAL', accountId: '11', amountCents: 10001 })).rejects.toMatchObject({ code: 'INSUFFICIENT_FUNDS' })
    await expect(bankService.submitTransaction({ type: 'TRANSFER', accountId: '11', destinationAccountId: '99', amountCents: 1 })).rejects.toMatchObject({ code: 'INVALID_DESTINATION' })
    expect(fetchMock.mock.calls.every(([, options]) => options?.method === 'GET')).toBe(true)
  })

  it('rejects a legacy HTTP-200 failure instead of showing a false success', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(new Response('Unable to locate account.'))
    await expect(bankService.submitTransaction({ type: 'DEPOSIT', accountId: '11', amountCents: 100 })).rejects.toMatchObject({ code: 'TRANSACTION_REJECTED' })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry a mutation after an ambiguous network failure and requires reconciliation', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts())).mockRejectedValueOnce(new TypeError('connection lost'))
    const request = { type: 'DEPOSIT' as const, accountId: '11', amountCents: 100 }
    await expect(bankService.submitTransaction(request)).rejects.toMatchObject({ code: 'TRANSACTION_STATUS_UNKNOWN' })
    await expect(bankService.submitTransaction(request)).rejects.toMatchObject({ code: 'REFRESH_REQUIRED' })
    expect(fetchMock.mock.calls.filter(([, options]) => options?.method === 'PUT')).toHaveLength(1)
    fetchMock.mockResolvedValueOnce(json(accounts())).mockResolvedValueOnce(json([])).mockResolvedValueOnce(json([]))
    await bankService.getDashboard()
  })

  it('does not suggest retrying a committed transaction when its refresh fails', async () => {
    fetchMock.mockResolvedValueOnce(json(accounts()))
      .mockResolvedValueOnce(new Response('Deposit of $1 was successful.'))
      .mockRejectedValueOnce(new TypeError('refresh failed'))
    await expect(bankService.submitTransaction({ type: 'DEPOSIT', accountId: '11', amountCents: 100 })).rejects.toMatchObject({ code: 'TRANSACTION_STATUS_UNKNOWN' })
    expect(fetchMock.mock.calls.filter(([, options]) => options?.method === 'PUT')).toHaveLength(1)
  })
})
