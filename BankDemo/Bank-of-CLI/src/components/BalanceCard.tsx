

export function BalanceCard({ balance, loading }: { balance: number; loading: boolean }) {
  return (
    <div className="card bal">
      <small>Available balance</small>

      <div className="amt mono" id="bal">
        {loading ? (
          <div
            className="sk"
            style={{
              height: "40px",
              width: "60%",
              margin: "8px 0",
              opacity: 0.5
            }}
          ></div>
        ) : (
          balance
        )}
      </div>

      <small className="mono">ACCT •••• 0421</small>
    </div>
  );
}
