import type { Transaction } from '../../types'
import './styles.css'

interface TransactionListProps {
  transactions: Transaction[]
  loading?: boolean
}

export function TransactionList({ transactions, loading = false }: TransactionListProps) {
  return (
    <section className="dashboard-card" aria-label="Recent transactions" aria-busy={loading}>
      <h2 className="dashboard-title">Recent transactions</h2>
      {loading ? (
        <div role="status" aria-label="Loading recent transactions">
          {[0, 1, 2, 3].map((row) => (
            <div className="dashboard-transaction" key={row} aria-hidden="true">
              <div className="dashboard-skeleton dashboard-description-skeleton" />
              <div className="dashboard-skeleton dashboard-value-skeleton" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? <p className="dashboard-empty">No recent transactions.</p> : (
        <ul className="dashboard-transactions">
          {transactions.map((transaction) => {
            const credit = transaction.type === 'DEPOSIT'
            return (
              <li className="dashboard-transaction" key={transaction.id}>
                <div className="dashboard-description">
                  {transaction.description}
                  <small>
                    <time dateTime={transaction.date}>{new Date(transaction.date).toLocaleDateString()}</time>
                    {' · '}{transaction.type}
                  </small>
                </div>
                <b className={`dashboard-mono dashboard-value ${credit ? 'dashboard-positive' : 'dashboard-negative'}`}>
                  {credit ? '+' : '−'}
                  {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </b>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
