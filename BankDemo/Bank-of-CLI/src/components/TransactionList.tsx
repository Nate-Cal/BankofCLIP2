export function TransactionList({
  transactions,
  loading,
}: {
  transactions: { id: string | number; type: string; description: string; amount: number }[];
  loading: boolean;
}) {
  return (
    <div className="card">
      <b>Recent transactions</b>

      <div style={{ marginTop: "8px" }}>
        {loading ? (
          <div className="sk" style={{ height: "20px", width: "80%", opacity: 0.5 }}></div>
        ) : transactions.length === 0 ? (
          <div className="mono" style={{ opacity: 0.6 }}>No recent transactions</div>
        ) : (
          transactions.map(tx => (
            <div key={tx.id} className="tx-row mono" style={{ marginBottom: "6px" }}>
              <div><b>{tx.type}</b> — {tx.description}</div>
              <div>{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
