import { useState } from 'react';
import { Field, Button, setErr, withLoading } from '../../util/Utilities';
import type { Transaction, MenuMode } from '../../models/banking';

interface ActionPanelProps {
  balanceCents: number;
  activeMenu: MenuMode;
  setActiveMenu: (menu: MenuMode) => void;
  transactions: Transaction[];
  onProcessTransaction: (amountCents: number, desc: string, to: string) => Promise<void>;
}

export function ActionPanel({ balanceCents, activeMenu, setActiveMenu, transactions, onProcessTransaction }: ActionPanelProps) {
  const [form, setForm] = useState({ amt: '', desc: '', to: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const amountNum = parseFloat(form.amt);
    const amountInCents = Math.round(amountNum * 100);
    let isValid = true;

    isValid = setErr(setErrors, 'amt', !isNaN(amountNum) && amountNum > 0 ? '' : 'Enter a valid amount greater than $0.00') && isValid;

    if (activeMenu === 'TRANSFER') {
      isValid = setErr(setErrors, 'to', form.to.trim() ? '' : 'Recipient is required.') && isValid;
    }

    if ((activeMenu === 'WITHDRAWAL' || activeMenu === 'TRANSFER') && amountInCents > balanceCents) {
      isValid = setErr(setErrors, 'amt', 'Insufficient funds in your account.') && isValid;
    }

    if (!isValid) return;

    await withLoading(setLoading, async () => {
      await onProcessTransaction(amountInCents, form.desc, form.to);
    });

    resetMenu();
  };

  const resetMenu = () => {
    setForm({ amt: '', desc: '', to: '' });
    setErrors({});
    setActiveMenu('MAIN');
  };

  const formTitle = 
    activeMenu === 'DEPOSIT' ? 'Make a Deposit' : 
    activeMenu === 'WITHDRAWAL' ? 'Initiate a Withdrawal' : 
    'Send Money';

  return (
    <section className="actions-card card">
      <div className="card-header-row">
        <b>Banking Actions</b>
        {activeMenu !== 'MAIN' && (
          <button className="btn-back" onClick={resetMenu} disabled={loading}>
            &larr; Back
          </button>
        )}
      </div>

      {activeMenu === 'MAIN' && (
        <div className="button-group-row">
          <button className="btn btn-deposit" onClick={() => setActiveMenu('DEPOSIT')}>
            <span className="icon">↓</span> Deposit
          </button>
          <button className="btn btn-withdrawal" onClick={() => setActiveMenu('WITHDRAWAL')}>
            <span className="icon">↑</span> Withdraw
          </button>
          <button className="btn btn-transfer" onClick={() => setActiveMenu('TRANSFER')}>
            <span className="icon">↗</span> Transfer
          </button>
          <button className="btn btn-transactions" onClick={() => setActiveMenu('TRANSACTIONS')}>
            <span className="icon">⇄</span> History
          </button>
        </div>
      )}

      {['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].includes(activeMenu) && (
        <div className="action-form">
          <h3>{formTitle}</h3>

          {activeMenu === 'TRANSFER' && (
            <div className="form-group">
              <Field
                id="to"
                label="Recipient Email/Username"
                value={form.to}
                onChange={v => setForm({ ...form, to: v })}
                error={errors.to}
                attrs={{ placeholder: "e.g. grace@bankofcli.dev", className: "theme-input", disabled: loading }}
              />
            </div>
          )}

          <div className="form-group">
            <Field
              id="amt"
              label="Amount (USD)"
              type="number"
              value={form.amt}
              onChange={v => setForm({ ...form, amt: v })}
              error={errors.amt}
              attrs={{ placeholder: "0.00", min: "0.01", step: "0.01", className: "theme-input", disabled: loading }}
            />
          </div>

          <div className="form-group">
            <Field
              id="desc"
              label="Description (Optional)"
              value={form.desc}
              onChange={v => setForm({ ...form, desc: v })}
              attrs={{ placeholder: "e.g. Rent, Utilities", className: "theme-input", disabled: loading }}
            />
          </div>
          
          <Button
            id="submit-action"
            label={`Submit ${activeMenu.toLowerCase()}`}
            onClick={handleSubmit}
            loading={loading}
            extra={`btn-${activeMenu.toLowerCase()} btn-submit`}
          />
        </div>
      )}

      {activeMenu === 'TRANSACTIONS' && (
        <div className="modal-view scroll-view">
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <p className="no-data">No transactions found.</p>
          ) : (
            <div className="modal-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="modal-list-item">
                  <div className="tx-details">
                    <span className="tx-desc">{tx.description}</span>
                    <span className="tx-date">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <span className={`tx-amt ${tx.type.toLowerCase()}`}>
                    {tx.direction === 'CREDIT' ? '+' : '-'}${(tx.amountCents / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}