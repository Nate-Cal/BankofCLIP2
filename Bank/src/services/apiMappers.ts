import type { Account, Transaction, User } from '../models/banking'
import { ServiceError } from './serviceError'

function invalid(field: string): never {
  throw new ServiceError('INVALID_API_RESPONSE', `The server returned an invalid ${field}.`)
}

export function objectValue(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid('response')
  return value as Record<string, unknown>
}

function idValue(value: unknown): string {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value > 0) return String(value)
  if (typeof value === 'string' && value.trim()) return value.trim()
  return invalid('ID')
}

/** Convert wire dollars to integer cents; never turn missing/invalid money into zero. */
export function dollarsToCents(value: unknown): number {
  if (typeof value === 'number') {
    const cents = Math.round(value * 100)
    // The existing API uses double. Tolerate only insignificant binary floating-point noise.
    if (value < 0 || !Number.isFinite(value) || !Number.isSafeInteger(cents)
      || Math.abs(value * 100 - cents) > 0.000001) return invalid('money amount')
    return cents
  }
  if (typeof value !== 'string' || !/^\d+(?:\.\d{1,2}0*)?$/.test(value.trim())) {
    return invalid('money amount')
  }
  const [dollars, fraction = ''] = value.trim().split('.')
  const cents = BigInt(dollars) * 100n + BigInt(fraction.slice(0, 2).padEnd(2, '0'))
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) return invalid('money amount')
  return Number(cents)
}

/** Avoid floating-point formatting when putting a cents amount into a dollar query parameter. */
export function centsToDollars(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    throw new ServiceError('INVALID_AMOUNT', 'Enter a valid amount greater than $0.00.')
  }
  const exact = BigInt(cents)
  return `${exact / 100n}.${String(exact % 100n).padStart(2, '0')}`
}

export function mapUser(value: unknown): User {
  const raw = objectValue(value)
  if (typeof raw.firstName !== 'string' || !raw.firstName.trim()
    || typeof raw.lastName !== 'string' || !raw.lastName.trim()
    || typeof raw.email !== 'string' || !raw.email.trim()) return invalid('user')
  return {
    id: idValue(raw.userId), userId: raw.email.trim(), email: raw.email.trim(),
    firstName: raw.firstName.trim(), lastName: raw.lastName.trim(),
  }
}

export function mapAccounts(value: unknown, ownerId: string): Account[] {
  if (!Array.isArray(value)) return invalid('account list')
  const seen = new Set<string>()
  return value.map((entry) => {
    const raw = objectValue(entry)
    // Current models use id/ownerId/balance/currency; retain the earlier DTO names too.
    const id = idValue(raw.id ?? raw.accountId)
    if (seen.has(id)) return invalid('duplicate account ID')
    seen.add(id)
    const owner = raw.ownerId ?? raw.userId
      ?? (raw.user == null ? undefined : objectValue(raw.user).userId)
    if (owner !== undefined && idValue(owner) !== ownerId) return invalid('account owner')
    if ((raw.currency ?? raw.currencyType) !== 'USD') return invalid('account currency')
    if (raw.type != null && raw.type !== 'CHECKING' && raw.type !== 'SAVINGS') return invalid('account type')
    const mask = raw.lastFour ?? raw.mask
    const lastFour = typeof mask === 'string' ? mask.match(/(\d{4})$/)?.[1] : undefined
    return {
      id,
      userId: ownerId,
      // The checked-in Account entity omits type; preserve the UI's checking default.
      type: raw.type === 'SAVINGS' ? 'SAVINGS' : 'CHECKING',
      name: typeof raw.name === 'string' && raw.name.trim() ? raw.name : `Account ${id}`,
      lastFour: lastFour ?? id.slice(-4).padStart(4, '0'),
      balanceCents: dollarsToCents(raw.balance ?? raw.accountBalance),
      currency: 'USD',
    }
  })
}

export function mapTransactions(value: unknown, accountId: string): Transaction[] {
  if (!Array.isArray(value)) return invalid('transaction list')
  return value.map((entry) => {
    const raw = objectValue(entry)
    const reportedAccount = raw.accountId ?? (raw.account == null ? undefined : objectValue(raw.account).accountId)
    if (reportedAccount !== undefined && idValue(reportedAccount) !== accountId) return invalid('transaction account')
    const typeName = typeof raw.type === 'string' ? raw.type.toUpperCase() : ''
    let type: Transaction['type']
    let direction: Transaction['direction']
    switch (typeName) {
      case 'DEPOSIT': type = 'DEPOSIT'; direction = 'CREDIT'; break
      case 'WITHDRAW':
      case 'WITHDRAWAL': type = 'WITHDRAWAL'; direction = 'DEBIT'; break
      case 'TRANSFER_IN':
      case 'TRANSFER/DEPOSIT': type = 'TRANSFER'; direction = 'CREDIT'; break
      case 'TRANSFER_OUT':
      case 'TRANSFER/WITHDRAWAL': type = 'TRANSFER'; direction = 'DEBIT'; break
      case 'TRANSFER':
        type = 'TRANSFER'
        if (raw.direction !== 'CREDIT' && raw.direction !== 'DEBIT') return invalid('transfer direction')
        direction = raw.direction
        break
      default: return invalid('transaction type')
    }
    if (typeof raw.date !== 'string' && typeof raw.date !== 'number') return invalid('transaction date')
    const date = new Date(raw.date)
    if (!Number.isFinite(date.getTime())) return invalid('transaction date')
    const amountCents = dollarsToCents(raw.amount)
    if (amountCents <= 0) return invalid('transaction amount')
    return {
      id: idValue(raw.id ?? raw.transactionId), accountId, type, direction, amountCents,
      description: typeof raw.description === 'string' && raw.description.trim()
        ? raw.description : type === 'TRANSFER'
          ? `Transfer ${direction === 'CREDIT' ? 'received' : 'sent'}`
          : type === 'DEPOSIT' ? 'Money deposit' : 'Cash withdrawal',
      createdAt: date.toISOString(), timestamp: date.toISOString(), status: 'COMPLETED',
      ...(raw.relatedAccountId == null ? {} : { relatedAccountId: idValue(raw.relatedAccountId) }),
    }
  })
}
