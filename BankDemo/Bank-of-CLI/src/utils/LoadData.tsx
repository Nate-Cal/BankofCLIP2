import { useState, useEffect } from "react";
import { AccountService } from "../service/AccountService";

const esc = (raw: string = "") =>
  raw.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char] ?? char));

export function useDashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Array<{ id: string | number; type: string; description: string; amount: number }>>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    setLoading(true);

    const [a, t] = await Promise.all([
      AccountService.getAccount(),
      AccountService.getTransactions()
    ]);

    setBalance(a.data.balance);
    setTransactions(
      (t.data as Array<{ id: string | number; type: string; description: string; date: string; amount: number }>).map(x => ({
        id: x.id,
        type: x.type,
        description: esc(x.description),
        amount: x.amount
      }))
    );

    setLoading(false);
  }

  useEffect(() => {
    void loadDashboardData();
  }, []);

  return {
    balance,
    transactions,
    loading,
    refresh: loadDashboardData
  };
}
