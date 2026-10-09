import { useEffect, useState } from 'react';
import { wait } from '../util/Utilities'; 
import { useToast } from '../components/Toast/ToastContainer'; 
import { BalanceCard } from '../components/Dashboard/BalanceCard';
import { ActionPanel } from '../components/Dashboard/ActionPanel';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import Footer from '../components/Footer/FooterContainer';

import type { Account, User } from '../types';
import type { Transaction, MenuMode } from '../models/banking'; 

import './Dashboard.css';

import mockDashboardData from '../mocks/dashboard.json';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { showToastMessage } = useToast();
  const [activeMenu, setActiveMenu] = useState<MenuMode>('MAIN');
  
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const [balanceCents, setBalanceCents] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let active = true;
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        await wait(600);
        
        if (!mockDashboardData.account.ok || !mockDashboardData.transactions.ok) {
          throw new Error('Unable to load mock data.');
        }
        
        if (active) {
          const mockAccount = mockDashboardData.account.data;
          
          setAccount(mockAccount as unknown as Account);
          setBalanceCents(Math.round(mockAccount.balance * 100));
          
          const mappedTransactions: Transaction[] = mockDashboardData.transactions.data.map((tx) => ({
            id: tx.id,
            accountId: mockAccount.id,
            description: tx.description,
            amountCents: Math.round(tx.amount * 100),
            type: tx.type === 'WITHDRAW' ? 'WITHDRAWAL' : (tx.type as Transaction['type']),
            direction: tx.type === 'DEPOSIT' ? 'CREDIT' : 'DEBIT',
            createdAt: tx.date, 
            status: 'COMPLETED'
          }));

          setTransactions(mappedTransactions);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load your dashboard. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboardData();
  }, [retry]);

  const handleProcessTransaction = async (amountInCents: number, desc: string, to: string) => {
    await wait(800); 

    setBalanceCents(prev => activeMenu === 'DEPOSIT' ? prev + amountInCents : prev - amountInCents);

    const defaultDesc = activeMenu === 'DEPOSIT' ? 'Deposit' : activeMenu === 'WITHDRAWAL' ? 'Withdrawal' : `Transfer to ${to}`;

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      accountId: account?.id || 'a1',
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

  const handleLogout = () => {
    showToastMessage("You have been signed out.", false);
    onLogout();
  };

  return (
    <main className="dashboard dark-theme" aria-label="Banking dashboard">
      <header className='dashboard-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: 0, lineHeight: '1.2' }}>
            <span style={{ color: 'var(--text-gray)', fontSize: '1.1rem', display: 'block', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Welcome back,
            </span>
            <span className="gradient-name">{user.name}</span>
          </h1>
        </div>
        
        <button type="button" className='btn-logout' onClick={handleLogout}>
          Log out
        </button>
      </header>

      {error ? (
        <div className="dashboard-card dashboard-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-transactions" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <BalanceCard balanceCents={balanceCents} />
            
            {!loading && (
              <ActionPanel 
                balanceCents={balanceCents}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                transactions={transactions}
                onProcessTransaction={handleProcessTransaction}
              />
            )}
          </div>

          {!loading && activeMenu !== 'TRANSACTIONS' && (
            <RecentActivity 
              transactions={transactions} 
              setActiveMenu={setActiveMenu} 
            />
          )}
        </>
      )}
      
      <Footer/>
    </main>
  );
}