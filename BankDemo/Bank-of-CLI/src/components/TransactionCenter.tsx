import { useState } from "react";
import { setErr, withLoading, toast, Button, Field } from "../utils/Database";
import { AccountService } from "../service/AccountService";

type TransactionCenterProps = {
  setToasts: React.Dispatch<React.SetStateAction<{ id: number; msg: string; bad: boolean }[]>>;
  refreshDashboard: () => Promise<void>;
};

export function TransactionCenter({ setToasts, refreshDashboard }: TransactionCenterProps) {
  const [txTab, setTxTab] = useState<"DEPOSIT" | "WITHDRAW" | "TRANSFER">("DEPOSIT");
  const [form, setForm] = useState({ amt: "", to: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const tabs: Array<"DEPOSIT" | "WITHDRAW" | "TRANSFER"> = ["DEPOSIT", "WITHDRAW", "TRANSFER"];

  const handleSubmit = async () => {
    const amount = Number.parseFloat(form.amt);
    const to = txTab === "TRANSFER" ? form.to.trim() : "";

    let ok = setErr(setErrors, "amt", amount > 0 ? "" : "Enter an amount greater than 0.");

    if (txTab === "TRANSFER") {
      ok =
        setErr(
          setErrors,
          "to",
          /^\S+@\S+\.\S+$/.test(to) ? "" : "Enter a valid recipient email."
        ) && ok;
    }

    if (!ok) return;

    const res = await withLoading(setLoading, async () =>
      AccountService.submit(txTab, amount, to)
    );

    if (!res || typeof res !== "object" || !("ok" in res) || !res.ok) {
      const errorMessage = res && typeof res === "object" && "error" in res && res.error && typeof res.error === "object" && "message" in res.error
        ? String(res.error.message)
        : "Transaction failed.";
      toast(setToasts, errorMessage, true);
      return;
    }

    toast(setToasts, `${amount.toLocaleString("en-US", { style: "currency", currency: "USD" })} ${txTab.toLowerCase()} successful`);
    setForm({ amt: "", to: "" });
    await refreshDashboard();
  };

  return (
    <div className="card">
      <b>Transaction center</b>

      <div className="tabs">
        {tabs.map(t => (
          <button
            key={t}
            className={t === txTab ? "on" : ""}
            onClick={() => setTxTab(t)}
          >
            {t[0] + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {txTab === "TRANSFER" && (
        <Field
          id="to"
          label="Recipient email"
          type="email"
          value={form.to}
          onChange={v => setForm({ ...form, to: v })}
          error={errors.to}
        />
      )}

      <Field
        id="amt"
        label="Amount (USD)"
        type="number"
        value={form.amt}
        onChange={v => setForm({ ...form, amt: v })}
        error={errors.amt}
        attrs={{
          inputMode: "decimal",
          min: "0.01",
          step: "0.01",
          placeholder: "0.00"
        }}
      />

      <Button
        id="sub"
        label={`Submit ${txTab.toLowerCase()}`}
        loading={loading}
        onClick={handleSubmit}
      />
    </div>
  );
}
