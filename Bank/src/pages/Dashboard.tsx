import { useState } from 'react';
import { wait } from '../util/Utilities'; 
import { useToast } from '../components/Toast/ToastContainer'; 
import { BalanceCard } from '../components/Dashboard/BalanceCard';
import { ActionPanel } from '../components/Dashboard/ActionPanel';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import type { Transaction, MenuMode } from '../models/banking'; 
import './Dashboard.css';

export function Dashboard() {
  const { showToastMessage } = useToast();
  const [activeMenu, setActiveMenu] = useState<MenuMode>('MAIN');
  
  // Data State using official 'cents' structure
  const [balanceCents, setBalanceCents] = useState<number>(1300050);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    { 
      id: 't_1', accountId: 'acc_1', type: 'DEPOSIT', direction: 'CREDIT', 
      description: 'Paycheck Deposit', amountCents: 250000, 
      createdAt: '2026-10-07T10:00:00Z', status: 'COMPLETED' 
    },
    { 
      id: 't_2', accountId: 'acc_1', type: 'WITHDRAWAL', direction: 'DEBIT', 
      description: 'Groceries Store', amountCents: 12450, 
      createdAt: '2026-10-06T14:30:00Z', status: 'COMPLETED' 
    },
    { 
      id: 't_3', accountId: 'acc_1', type: 'WITHDRAWAL', direction: 'DEBIT', 
      description: 'Monthly Subscription', amountCents: 1599, 
      createdAt: '2026-10-04T09:15:00Z', status: 'COMPLETED' 
    },
    { 
      id: 't_4', accountId: 'acc_1', type: 'WITHDRAWAL', direction: 'DEBIT', 
      description: 'ATM Cash Withdrawal', amountCents: 10000, 
      createdAt: '2026-10-02T18:45:00Z', status: 'COMPLETED' 
    }
  ]);

  const handleProcessTransaction = async (amountInCents: number, desc: string, to: string) => {
    await wait(800); 

    setBalanceCents(prev => activeMenu === 'DEPOSIT' ? prev + amountInCents : prev - amountInCents);

    const defaultDesc = activeMenu === 'DEPOSIT' ? 'Deposit' : activeMenu === 'WITHDRAWAL' ? 'Withdrawal' : `Transfer to ${to}`;

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      accountId: 'acc_1',
      description: desc.trim() || defaultDesc,
      amountCents: amountInCents,
      type: activeMenu as Transaction['type'],
      direction: activeMenu === 'DEPOSIT' ? 'CREDIT' : 'DEBIT',
      createdAt: new Date().toISOString(),
      status: 'COMPLETED'
    };
    
    setTransactions(prev => [newTx, ...prev]);

    const actionText = activeMenu === 'DEPOSIT' ? 'deposited' : activeMenu === 'WITHDRAWAL' ? 'withdrawn' : 'transferred';
    showToastMessage(`Successfully ${actionText} $${(amountInCents / 100).toFixed(2)}`, false);
  };

  return (
    <main className="dashboard dark-theme" aria-label="Banking dashboard">
      <div className="dashboard-header">
        <h1>Banking Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <BalanceCard balanceCents={balanceCents} />
        
        <ActionPanel 
          balanceCents={balanceCents}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          transactions={transactions}
          onProcessTransaction={handleProcessTransaction}
        />
      </div>

      {activeMenu !== 'TRANSACTIONS' && (
        <RecentActivity 
          transactions={transactions} 
          setActiveMenu={setActiveMenu} 
        />
      )}
    </main>
  );
}