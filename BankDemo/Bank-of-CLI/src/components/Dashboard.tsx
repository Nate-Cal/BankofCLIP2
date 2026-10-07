import { BalanceCard } from "./BalanceCard";
import { TransactionCenter } from "./TransactionCenter";
import { TransactionList } from "./TransactionList";
import { useDashboard } from "../utils/LoadData";

type DashboardProps = {
  user: { id: string; name: string; email: string };
  onLogout: () => void;
  setToasts: React.Dispatch<React.SetStateAction<{ id: number; msg: string; bad: boolean }[]>>;
};

export function Dashboard({ user, onLogout, setToasts }: DashboardProps) {
  const { balance, transactions, loading, refresh } = useDashboard();

  return (
    <>
      <header>
        <div className="logo">&gt;_ Bank of <b>CLI</b></div>

        <div>
          <span style={{ color: "var(--mute)", fontSize: ".85rem", marginRight: "10px" }}>
            {user.name}
          </span>

          <button className="btn ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <div className="grid">
        <div className="col">
          <BalanceCard balance={balance ?? 0} loading={loading} />
          <TransactionCenter setToasts={setToasts} refreshDashboard={refresh} />
        </div>

        <TransactionList transactions={transactions} loading={loading} />
      </div>
    </>
  );
}
