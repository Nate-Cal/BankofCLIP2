import type { Account } from '../../models/banking'
import './styles.css'

interface BalanceCardProps {
  account?: Account
  loading?: boolean
}

export function BalanceCard({ account, loading = false }: BalanceCardProps) {
  return (
    <section className="dashboard-card dashboard-balance" aria-label="Available balance" aria-busy={loading}>
      <small>Available balance</small>
      <div className="dashboard-amount dashboard-mono">
        {loading ? <div className="dashboard-skeleton dashboard-balance-skeleton" aria-hidden="true" /> : account ? (
          (account.balanceCents / 100).toLocaleString('en-US', { style: 'currency', currency: account.currency })
        ) : '—'}
      </div>
      {loading ? <small role="status">Loading balance…</small> : account ? (
        <small className="dashboard-mono">ACCT •••• {account.lastFour}</small>
      ) : <small>No account available.</small>}
    </section>
  )
}
