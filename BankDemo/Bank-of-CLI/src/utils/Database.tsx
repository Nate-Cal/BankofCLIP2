// utils.js

// Fake server delay
export const wait = (ms = 900) =>
  new Promise(resolve => setTimeout(resolve, ms));

// Standardized error response
export const fail = (code: string, message: string) => ({
  ok: false,
  error: { code, message }
});

// Fake in‑memory database
export const db = {
  user: { id: "u1", name: "Ada Lovelace", email: "ada@bankofcli.dev" },

  account: {
    id: "a1",
    ownerId: "u1",
    balance: 4280.5,
    currency: "USD"
  },

  txs: [
    {
      id: "t3",
      type: "DEPOSIT",
      amount: 1200,
      date: "2026-09-25T10:00:00Z",
      description: "Paycheck"
    },
    {
      id: "t2",
      type: "WITHDRAW",
      amount: 60,
      date: "2026-09-24T18:30:00Z",
      description: "ATM withdrawal"
    },
    {
      id: "t1",
      type: "TRANSFER",
      amount: 250,
      date: "2026-09-22T09:15:00Z",
      description: "Transfer to grace@bankofcli.dev"
    }
  ]
};

// Reusable button (used for Sign in, Register, Submit...)
export function Button({ label, id, extra = "", loading, onClick }: {
  label: string;
  id?: string;
  extra?: string;
  loading?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button id={id} className={`btn ${extra}`} onClick={onClick} disabled={loading}>
      {loading ? <span className="spin"></span> : <span>{label}</span>}
    </button>
  );
}

// Reusable input with label + error line under it
type FieldProps = {
  id: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  attrs?: React.InputHTMLAttributes<HTMLInputElement>;
};

export function Field({ id, label, type = "text", value, onChange, error, attrs = {} }: FieldProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...attrs}
      />
      <div className="err">{error}</div>
    </>
  );
}


// Shows/clears the red error text under a field. Returns true if valid.
export function setErr(
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  field: string,
  msg: string
): boolean {
  setErrors(prev => ({ ...prev, [field]: msg }));
  return !msg;
}
// Spinner on a button while a (fake) server call runs
export async function withLoading(setLoading: (loading: boolean) => void, fn: () => Promise<unknown>) {
  setLoading(true);
  try {
    return await fn();
  } finally {
    setLoading(false);
  }
}

export function toast(
  setToasts: React.Dispatch<React.SetStateAction<{ id: number; msg: string; bad: boolean }[]>>,
  msg: string,
  bad = false
) {
  const id = Date.now();
  setToasts(prev => [...prev, { id, msg, bad }]);

  setTimeout(() => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, 3200);
}



