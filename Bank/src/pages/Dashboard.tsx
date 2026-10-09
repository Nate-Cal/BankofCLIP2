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

// Expanded App-Level View State
type ViewMode = 'ACCOUNT_SELECT' | 'DASHBOARD' | 'ACTIONS' | 'HISTORY';

export function Dashboard({ user, onLogout }: DashboardProps) {
  const { showToastMessage } = useToast();
  
  // App Routing
  const [currentView, setCurrentView] = useState<ViewMode>('ACCOUNT_SELECT');
  const [activeMenu, setActiveMenu] = useState<MenuMode>('DEPOSIT');
  
  // Account Data State
  const [accounts, setAccounts] = useState<any[]>([]);
  const [activeAccount, setActiveAccount] = useState<any>(null);
  
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
        await wait(1000); // Simulated network delay
        
        if (!mockDashboardData.account.ok || !mockDashboardData.transactions.ok) {
          throw new Error('Unable to load mock data.');
        }
        
        if (active) {
          const mockAccount = mockDashboardData.account.data;
          
          // Generate a professional multi-account list based on the mock data
          const fetchedAccounts = [
            {
              id: mockAccount.id,
              name: 'Checking Account',
              balanceCents: Math.round(mockAccount.balance * 100),
              mask: '•••• 0421'
            },
            {
              id: 'a2',
              name: 'High-Yield Savings',
              balanceCents: 2450075, // $24,500.75
              mask: '•••• 8912'
            }
          ];
          
          setAccounts(fetchedAccounts);
          
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

  const handleSelectAccount = (acc: any) => {
    setActiveAccount(acc);
    setBalanceCents(acc.balanceCents);
    setCurrentView('DASHBOARD');
  };

  const handleProcessTransaction = async (amountInCents: number, desc: string, to: string) => {
    await wait(800); 

    setBalanceCents(prev => activeMenu === 'DEPOSIT' ? prev + amountInCents : prev - amountInCents);

    const defaultDesc = activeMenu === 'DEPOSIT' ? 'Deposit' : activeMenu === 'WITHDRAWAL' ? 'Withdrawal' : `Transfer to ${to}`;

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      accountId: activeAccount?.id || 'a1',
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
    
    // Auto-redirect to dashboard to see the new balance/history
    setCurrentView('DASHBOARD');
  };

  const handleLogout = () => {
    showToastMessage("You have been signed out.", false);
    onLogout();
  };

  return (
    <main className="dashboard dark-theme" aria-label="Banking dashboard">
      <header className='dashboard-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          {currentView === 'ACCOUNT_SELECT' ? (
            <h1 style={{ marginBottom: 0, lineHeight: '1.2' }}>
              <span style={{ color: 'var(--text-gray)', fontSize: '1.1rem', display: 'block', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Welcome back,
              </span>
              <span className="gradient-name">{user.name}</span>
            </h1>
          ) : (
            <h1 style={{ marginBottom: 0, lineHeight: '1.2' }}>
              <button 
                className="link-button" 
                onClick={() => setCurrentView('ACCOUNT_SELECT')} 
                style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                &larr; Switch Account
              </button>
              <span className="gradient-name">{activeAccount?.name}</span>
            </h1>
          )}
        </div>
        
        <button type="button" className='btn-logout' onClick={handleLogout}>
          Log out
        </button>
      </header>

      {/* Render Navigation Bar ONLY if an account is selected */}
      {currentView !== 'ACCOUNT_SELECT' && (
        <nav className="top-nav-bar fade-in">
          <button 
            className={`nav-tab ${currentView === 'DASHBOARD' ? 'active' : ''}`}
            onClick={() => setCurrentView('DASHBOARD')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-tab ${currentView === 'ACTIONS' ? 'active' : ''}`}
            onClick={() => setCurrentView('ACTIONS')}
          >
            Move Money
          </button>
          <button 
            className={`nav-tab ${currentView === 'HISTORY' ? 'active' : ''}`}
            onClick={() => setCurrentView('HISTORY')}
          >
            History
          </button>
        </nav>
      )}

      {error ? (
        <div className="dashboard-card dashboard-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-submit" onClick={() => setRetry((value) => value + 1)}>
            Try again
          </button>
        </div>
      ) : loading ? (
        /* Skeleton UI Loader */
        <div className="account-cards-grid">
          <div className="card skeleton-card" style={{ height: '180px' }}>
            <div className="skeleton-line" style={{ width: '120px', height: '1.5rem' }}></div>
            <div className="skeleton-line" style={{ width: '200px', height: '3rem', marginTop: 'auto' }}></div>
          </div>
          <div className="card skeleton-card" style={{ height: '180px' }}>
            <div className="skeleton-line" style={{ width: '120px', height: '1.5rem' }}></div>
            <div className="skeleton-line" style={{ width: '200px', height: '3rem', marginTop: 'auto' }}></div>
          </div>
        </div>
      ) : (
        /* Dynamic App Views based on Navigation */
        <div className="view-container fade-in">
          
          {currentView === 'ACCOUNT_SELECT' && (
            <div className="account-cards-grid">
              {accounts.map(acc => (
                <div key={acc.id} className="card account-selection-card" onClick={() => handleSelectAccount(acc)}>
                  <div className="acc-info">
                    <h3 className="acc-name">{acc.name}</h3>
                    <span className="acc-mask">{acc.mask}</span>
                  </div>
                  <div className="acc-bal">
                    ${(acc.balanceCents / 100).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentView === 'DASHBOARD' && (
            <div className="dashboard-grid">
              <BalanceCard balanceCents={balanceCents} />
              <div className="card" style={{ padding: '1.25rem' }}>
                <RecentActivity 
                  transactions={transactions.slice(0, 3)} 
                  setActiveMenu={() => {}} 
                />
                <button className="link-button" onClick={() => setCurrentView('HISTORY')} style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}>
                  View All History &rarr;
                </button>
              </div>
            </div>
          )}

          {currentView === 'ACTIONS' && (
            <div className="dashboard-grid single-col">
              <ActionPanel 
                balanceCents={balanceCents}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                transactions={transactions}
                onProcessTransaction={handleProcessTransaction}
              />
            </div>
          )}

          {currentView === 'HISTORY' && (
            <div className="card history-view">
               <RecentActivity 
                  transactions={transactions} 
                  setActiveMenu={() => {}} 
                />
            </div>
          )}

        </div>
      )}
      
      <Footer/>
    </main>
  );
}