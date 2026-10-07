import { useEffect, useState } from 'react'
import { BalanceCard } from '../components/Dashboard/BalanceCard'
import { TransactionList } from '../components/Dashboard/TransactionList'
import type { Account, Transaction } from '../types'
import { DashboardService } from '../services/DashboardService'
import './Dashboard.css'

interface DashboardProps {
  // Increment after a successful transaction to reload Section 5.
  refreshKey?: number
  service?: typeof DashboardService
}

export function Dashboard({ refreshKey = 0, service = DashboardService }: DashboardProps) {
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    async function loadDashboardData() {
      setLoading(true)
      setError(null)
      try {
        const [accountResult, transactionsResult] = await Promise.all([
          service.getAccount(),
          service.getTransactions(),
        ])
        // ApiResult uses optional data, so check both success and its payload.
        if (!accountResult.ok || !accountResult.data) {
          throw new Error(accountResult.error?.message || 'Unable to load your account.')
        }
        if (!transactionsResult.ok || !transactionsResult.data) {
          throw new Error(transactionsResult.error?.message || 'Unable to load recent transactions.')
        }
        if (active) {
          setAccount(accountResult.data)
          setTransactions(transactionsResult.data)
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load your dashboard. Please try again.')
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
            <BalanceCard account={account ?? undefined} loading={loading} />
          </div>
          <TransactionList transactions={transactions} loading={loading} />
        </>
      )}
    </main>
  )
}
