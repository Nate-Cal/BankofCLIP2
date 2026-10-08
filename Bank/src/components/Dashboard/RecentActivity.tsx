import type { Transaction, MenuMode } from '../../models/banking';

interface RecentActivityProps {
  transactions: Transaction[];
  setActiveMenu: (menu: MenuMode) => void;
}

export function RecentActivity({ transactions, setActiveMenu }: RecentActivityProps) {
  return (
    <section className="transaction-history-list card">
      <div className="list-title-row">
        <h3>Recent Activity</h3>
        <button className="link-button" onClick={() => setActiveMenu('TRANSACTIONS')}>
          Show all ({transactions.length})
        </button>
      </div>
      <div className="activity-rows">
        {transactions.slice(0, 4).map((tx) => (
          <div key={tx.id} className="activity-row-item">
            <div className="activity-info">
              <div className={`badge badge-${tx.type.toLowerCase()}`}>
                {tx.type === 'DEPOSIT' ? '↓' : tx.type === 'WITHDRAWAL' ? '↑' : '↗'}
              </div>
              <div>
                <p className="activity-title">{tx.description}</p>
                <span className="activity-date">
                  {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div className={`activity-val ${tx.type.toLowerCase()}`}>
              {tx.direction === 'CREDIT' ? '+' : '-'}${(tx.amountCents / 100).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}