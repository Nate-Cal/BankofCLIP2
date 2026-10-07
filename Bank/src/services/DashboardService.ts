import mockDashboard from '../mocks/dashboard.json'
import type { BankService, DashboardResponse } from '../models/banking'

// Only the read operation needed by Section 5; uses the existing banking model.
export const DashboardService: Pick<BankService, 'getDashboard'> = {
  async getDashboard(): Promise<DashboardResponse> {
    await new Promise<void>((resolve) => setTimeout(resolve, 900))
    return structuredClone(mockDashboard) as DashboardResponse
  },
}
