import type { BankService, Transaction } from '../models/banking'
import {
  currentUser,
  mockStore,
  ServiceError,
  simulateLatency,
} from './mockStore'

export const bankService: BankService = {
  async getDashboard() {
    await simulateLatency()
    const user = currentUser()
    const accounts = mockStore.accounts.filter(
      (account) => account.userId === user.id,
    )
    const accountIds = new Set(accounts.map((account) => account.id))
    const transactions = mockStore.transactions
      .filter((transaction) => accountIds.has(transaction.accountId))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    return structuredClone({ user, accounts, transactions })
  },

  async submitTransaction(request) {
    await simulateLatency()
    const user = currentUser()
    const account = mockStore.accounts.find(
      (candidate) =>
        candidate.id === request.accountId && candidate.userId === user.id,
    )
    if (!account)
      throw new ServiceError(
        'ACCOUNT_NOT_FOUND',
        'Please choose one of your accounts.',
      )
    if (
      !Number.isSafeInteger(request.amountCents) ||
      request.amountCents <= 0
    ) {
      throw new ServiceError(
        'INVALID_AMOUNT',
        'Enter a valid amount greater than $0.00.',
      )
    }
    if (
      request.type !== 'DEPOSIT' &&
      request.type !== 'WITHDRAWAL' &&
      request.type !== 'TRANSFER'
    ) {
      throw new ServiceError(
        'VALIDATION_ERROR',
        'Choose a valid transaction type.',
      )
    }
    if (
      request.type !== 'DEPOSIT' &&
      request.amountCents > account.balanceCents
    ) {
      throw new ServiceError(
        'INSUFFICIENT_FUNDS',
        'This amount is higher than your available balance.',
      )
    }
    const destination =
      request.type === 'TRANSFER'
        ? mockStore.accounts.find(
            (candidate) =>
              candidate.id === request.destinationAccountId &&
              candidate.userId === user.id,
          )
        : undefined
    if (
      request.type === 'TRANSFER' &&
      (!destination || destination.id === account.id)
    ) {
      throw new ServiceError(
        'INVALID_DESTINATION',
        'Choose a different account to receive the transfer.',
      )
    }
    const creditAccount = request.type === 'DEPOSIT' ? account : destination
    if (
      creditAccount &&
      !Number.isSafeInteger(creditAccount.balanceCents + request.amountCents)
    ) {
      throw new ServiceError(
        'INVALID_AMOUNT',
        'This amount is too large. Please enter a smaller amount.',
      )
    }
    const createdAt = new Date().toISOString()
    const direction = request.type === 'DEPOSIT' ? 'CREDIT' : 'DEBIT'
    const description =
      request.note?.trim() ||
      (request.type === 'TRANSFER'
        ? `Transfer to ${destination!.name}`
        : request.type === 'DEPOSIT'
          ? 'Money deposit'
          : 'Cash withdrawal')
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      accountId: account.id,
      type: request.type,
      direction,
      description,
      amountCents: request.amountCents,
      createdAt,
      status: 'COMPLETED',
      ...(destination ? { relatedAccountId: destination.id } : {}),
    }
    const transactions = [transaction]
    account.balanceCents +=
      direction === 'CREDIT' ? request.amountCents : -request.amountCents
    if (destination) {
      destination.balanceCents += request.amountCents
      transactions.push({
        ...transaction,
        id: crypto.randomUUID(),
        accountId: destination.id,
        direction: 'CREDIT',
        description: request.note?.trim() || `Transfer from ${account.name}`,
        relatedAccountId: account.id,
      })
    }
    mockStore.transactions.unshift(...transactions)
    return structuredClone({
      accounts: mockStore.accounts.filter(
        (candidate) => candidate.userId === user.id,
      ),
      transactions,
    })
  },
}
