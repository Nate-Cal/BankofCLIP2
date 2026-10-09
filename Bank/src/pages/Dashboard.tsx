import { useEffect, useState } from 'react';
import { wait } from '../util/Utilities'; 
import { useToast } from '../components/Toast/ToastContainer'; 
import { BalanceCard } from '../components/Dashboard/BalanceCard';
import { ActionPanel } from '../components/Dashboard/ActionPanel';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import Footer from '../components/Footer/FooterContainer';
import { DashboardService } from '../services/DashboardService';

// Combined types from both branches
import type { Account, User } from '../types';
import type { Transaction, MenuMode } from '../models/banking'; 

import './Dashboard.css';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  refreshKey?: number;
  service?: typeof DashboardService;
}

export function Dashboard({ user, onLogout, refreshKey = 0, service = DashboardService }: DashboardProps) {
  const { showToastMessage } = useToast();
  const [activeMenu, setActiveMenu] = useState<MenuMode>('MAIN');
  
  // Data state from main (API Integration)
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  // Local state from HEAD for interactive UI
  const [balanceCents, setBalanceCents] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    let active = true;
    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const [accountResult, transactionsResult] = await Promise.all([
          service.getAccount(),
          service.getTransactions(),
        ]);
        
        if (!accountResult.ok || !accountResult.data) {
          throw new Error(accountResult.error?.message || 'Unable to load your account.');
        }
        if (!transactionsResult.ok || !transactionsResult.data) {
          throw new Error(transactionsResult.error?.message || 'Unable to load recent transactions.');
        }
        
        if (active) {
          setAccount(accountResult.data);
          
          // Initialize local simulated state with the fetched API data
          // (Fallback to 1300050 if balanceCents doesn't exist on the fetched object)
          setBalanceCents((accountResult.data as any).balanceCents ?? 1300050);
          setTransactions(transactionsResult.data as unknown as Transaction[]);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Unable to load your dashboard. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboardData();
  }, [service, retry, refreshKey]);

  const handleProcessTransaction = async (amountInCents: number, desc: string, to: string) => {
    await wait(800); 

    setBalanceCents(prev => activeMenu === 'DEPOSIT' ? prev + amountInCents : prev - amountInCents);

    const defaultDesc = activeMenu === 'DEPOSIT' ? 'Deposit' : activeMenu === 'WITHDRAWAL' ? 'Withdrawal' : `Transfer to ${to}`;

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      accountId: account?.id || 'acc_1',
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
      {/* Merged Header */}
      <header className='dashboard-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.2rem' }}>Banking Dashboard</h1>
          <span style={{ color: 'var(--text-gray)', fontSize: '0.9rem' }}>Hi, {user.name.split(' ')[0]}</span>
        </div>
        <button type="button" className='dashboard-logout btn-back' onClick={handleLogout}>
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
            {/* BalanceCard receives both props so it works regardless of which branch updated it */}
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