import { useEffect, useState } from 'react'
import { BalanceCard } from '../components/Dashboard/BalanceCard'
import { TransactionList } from '../components/Dashboard/TransactionList'
import type { BankService, DashboardResponse } from '../models/banking'
import { DashboardService } from '../services/DashboardService'
import './Dashboard.css'

interface DashboardProps {
  // Increment after a successful transaction to reload Section 5.
  refreshKey?: number
  service?: Pick<BankService, 'getDashboard'>
}

export function Dashboard({ refreshKey = 0, service = DashboardService }: DashboardProps) {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    async function loadDashboardData() {
      setLoading(true)
      setError(null)
      try {
        const result = await service.getDashboard()
        if (active) setData(result)
      } catch {
        if (active) setError('Unable to load your dashboard. Please try again.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadDashboardData()
    // Ignore a response after leaving the screen or starting a newer load.
    return () => { active = false }
  }, [refreshKey, retry, service])

  return (
    <main className="dashboard" aria-label="Account dashboard">
      {error ? (
        <div className="dashboard-card dashboard-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => setRetry((value) => value + 1)}>Try again</button>
        </div>
      ) : (
        <>
          <div className="dashboard-accounts">
            {loading ? <BalanceCard loading /> : data?.accounts.length ? (
              data.accounts.map((account) => <BalanceCard key={account.id} account={account} />)
            ) : <BalanceCard />}
          </div>
          <TransactionList transactions={data?.transactions ?? []} loading={loading} />
        </>
      )}
    </main>
  )
}
