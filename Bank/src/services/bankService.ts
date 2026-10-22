import type { Account, BankService, DashboardResponse, TransactionRequest } from '../models/banking'
import { apiRequest } from './apiClient'
import { apiRoutes } from './apiConfig'
import { centsToDollars, mapAccounts, mapTransactions } from './apiMappers'
import { assertCurrentSession, requireSession } from './authSession'
import type { AuthSession } from './authSession'
import { ServiceError } from './serviceError'

let pendingMutation: AuthSession | null = null
let needsRefresh: AuthSession | null = null

async function getAccounts(session: AuthSession): Promise<Account[]> {
  return mapAccounts(await apiRequest(apiRoutes.accounts, { authenticated: true, session }), session.user.id)
}

async function readDashboard(session: AuthSession): Promise<DashboardResponse> {
  const accounts = await getAccounts(session)
  const lists = await Promise.all(accounts.map(async (account) =>
    mapTransactions(await apiRequest(apiRoutes.history(account.id), { authenticated: true, session }), account.id),
  ))
  assertCurrentSession(session)
  const transactions = lists.flat()
  if (new Set(transactions.map((item) => item.id)).size !== transactions.length) {
    throw new ServiceError('INVALID_API_RESPONSE', 'The server returned duplicate transaction IDs.')
  }
  transactions.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || b.id.localeCompare(a.id))
  return { user: { ...session.user }, accounts, transactions }
}

function validateRequest(request: TransactionRequest): void {
  centsToDollars(request.amountCents)
  if (!['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].includes(request.type)) {
    throw new ServiceError('VALIDATION_ERROR', 'Choose a valid transaction type.')
  }
  if (!request.accountId?.trim()) throw new ServiceError('ACCOUNT_NOT_FOUND', 'Choose an account.')
  if (request.type === 'TRANSFER'
    && (!request.destinationAccountId?.trim() || request.destinationAccountId === request.accountId)) {
    throw new ServiceError('INVALID_DESTINATION', 'Choose a different destination account.')
  }
  if (request.note?.trim()) {
    throw new ServiceError('NOTES_NOT_SUPPORTED', 'Transaction notes are not available yet. Clear the note to continue.')
  }
}

function checkAccounts(request: TransactionRequest, accounts: Account[]): void {
  const source = accounts.find((account) => account.id === request.accountId)
  if (!source) throw new ServiceError('ACCOUNT_NOT_FOUND', 'Choose one of your accounts.')
  if (request.type !== 'DEPOSIT' && source.balanceCents < request.amountCents) {
    throw new ServiceError('INSUFFICIENT_FUNDS', 'This amount is higher than your available balance.')
  }
  const destination = request.type === 'TRANSFER'
    ? accounts.find((account) => account.id === request.destinationAccountId) : undefined
  if (request.type === 'TRANSFER' && !destination) {
    throw new ServiceError('INVALID_DESTINATION', 'Choose one of your other accounts.')
  }
  const credited = request.type === 'DEPOSIT' ? source : destination
  if (credited && !Number.isSafeInteger(credited.balanceCents + request.amountCents)) {
    throw new ServiceError('INVALID_AMOUNT', 'This amount would exceed the supported balance.')
  }
}

export const bankService: BankService = {
  async getDashboard() {
    const session = requireSession()
    const dashboard = await readDashboard(session)
    if (needsRefresh === session) needsRefresh = null
    return dashboard
  },

  async submitTransaction(request) {
    const session = requireSession()
    if (pendingMutation === session) throw new ServiceError('TRANSACTION_PENDING', 'A transaction is already in progress.')
    if (needsRefresh === session) {
      throw new ServiceError('REFRESH_REQUIRED', 'Sign out and sign in to reload your accounts before submitting again.')
    }
    validateRequest(request)
    pendingMutation = session
    let sent = false
    let accepted = false
    try {
      // This check improves feedback; the server must independently enforce ownership and balances.
      checkAccounts(request, await getAccounts(session))
      const params = new URLSearchParams({ amount: centsToDollars(request.amountCents) })
      if (request.type === 'TRANSFER') params.set('transferAccountId', request.destinationAccountId!)
      const path = request.type === 'DEPOSIT' ? apiRoutes.deposit(request.accountId)
        : request.type === 'WITHDRAWAL' ? apiRoutes.withdraw(request.accountId) : apiRoutes.transfer(request.accountId)
      sent = true
      const response = await apiRequest(path + '?' + params, {
        method: 'PUT', authenticated: true, session, responseType: 'mutation',
      })
      const body = response && typeof response === 'object' && !Array.isArray(response)
        ? response as Record<string, unknown> : null
      const message = typeof response === 'string' ? response
        : typeof body?.message === 'string' ? body.message : undefined
      // Existing controllers can return business failures as HTTP 200.
      if (typeof body?.error === 'string' || body?.success === false
        || (message && /unable|cannot|invalid|insufficient|unsuccessful|not found|failed/i.test(message))) {
        throw new ServiceError('TRANSACTION_REJECTED',
          typeof body?.error === 'string' ? body.error : message || 'The server rejected the transaction.')
      }
      const confirmed = response === undefined || body?.success === true
        || (message !== undefined && /\b(?:was|is) successful\b|^success(?:ful)?[.!]?$/i.test(message))
      if (!confirmed) {
        throw new ServiceError('INVALID_API_RESPONSE', 'The server did not confirm the transaction.')
      }
      accepted = true
      const dashboard = await readDashboard(session)
      // Return the authoritative full history. App replaces its previous history with this response.
      return { accounts: dashboard.accounts, transactions: dashboard.transactions }
    } catch (error) {
      const uncertain = accepted || (sent && (error instanceof ServiceError)
        && (['NETWORK_ERROR', 'REQUEST_TIMEOUT', 'INVALID_API_RESPONSE'].includes(error.code) || error.status >= 500))
      if (uncertain) {
        needsRefresh = session
        throw new ServiceError('TRANSACTION_STATUS_UNKNOWN',
          'The transaction may have completed. Sign out and sign in to check your activity before submitting again.')
      }
      throw error
    } finally {
      if (pendingMutation === session) pendingMutation = null
    }
  },
}
