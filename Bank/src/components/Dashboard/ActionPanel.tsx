import { useState, useEffect } from 'react';
import { Field, Button, setErr, withLoading } from '../../util/Utilities';
import type { Transaction, MenuMode } from '../../models/banking';

interface ActionPanelProps {
  balanceCents: number;
  activeMenu: MenuMode;
  setActiveMenu: (menu: MenuMode) => void;
  transactions: Transaction[];
  onProcessTransaction: (amountCents: number, desc: string, to: string) => Promise<void>;
}

export function ActionPanel({ balanceCents, activeMenu, setActiveMenu, onProcessTransaction }: ActionPanelProps) {
  const [form, setForm] = useState({ amt: '', desc: '', to: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Default to DEPOSIT when this panel mounts if it was on MAIN
  useEffect(() => {
    if (activeMenu === 'MAIN' || activeMenu === 'TRANSACTIONS') {
      setActiveMenu('DEPOSIT');
    }
  }, [activeMenu, setActiveMenu]);

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

    setForm({ amt: '', desc: '', to: '' });
    setErrors({});
  };

  const formTitle = 
    activeMenu === 'DEPOSIT' ? 'Make a Deposit' : 
    activeMenu === 'WITHDRAWAL' ? 'Initiate a Withdrawal' : 
    'Send Money';

  return (
    <section className="actions-card card">
      
      {/* Sleek Segmented Control for Professional UIs */}
      <div className="segmented-control">
        <button 
          className={`segment-btn ${activeMenu === 'DEPOSIT' ? 'active' : ''}`} 
          onClick={() => { setActiveMenu('DEPOSIT'); setErrors({}); }}
        >
          Deposit
        </button>
        <button 
          className={`segment-btn ${activeMenu === 'WITHDRAWAL' ? 'active' : ''}`} 
          onClick={() => { setActiveMenu('WITHDRAWAL'); setErrors({}); }}
        >
          Withdraw
        </button>
        <button 
          className={`segment-btn ${activeMenu === 'TRANSFER' ? 'active' : ''}`} 
          onClick={() => { setActiveMenu('TRANSFER'); setErrors({}); }}
        >
          Transfer
        </button>
      </div>

      <div className="action-form">
        <h3 style={{ marginTop: '0.5rem' }}>{formTitle}</h3>

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
          extra={`btn-submit`}
        />
      </div>
    </section>
  );
}