import mockDashboard from '../mocks/dashboard.json'
import type { GetAccountResponse } from '../contracts/account'
import type { GetTransactionsResponse } from '../contracts/transactions'

// These read operations follow the shared Section 1 API contracts.
// Replace the mock reads with API calls when the backend is ready.
export const DashboardService = {
  async getAccount(): Promise<GetAccountResponse> {
    await new Promise<void>((resolve) => setTimeout(resolve, 700))
    return structuredClone(mockDashboard.account) as GetAccountResponse
  },

  async getTransactions(): Promise<GetTransactionsResponse> {
    await new Promise<void>((resolve) => setTimeout(resolve, 900))
    return structuredClone(mockDashboard.transactions) as GetTransactionsResponse
  },
}
