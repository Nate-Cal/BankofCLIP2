import { wait, fail, db } from "../utils/Database";

export const AccountService = {
  async getAccount() {
    await wait(700);
    return { ok: true, data: { ...db.account } };
  },

  async getTransactions() {
    await wait(900);
    return { ok: true, data: [...db.txs] };
  },

  async submit(type: string, amount: number, toEmail: string) {
    await wait();

    if (type !== "DEPOSIT" && amount > db.account.balance) {
      return fail("INSUFFICIENT_FUNDS", "Not enough funds for this transaction.");
    }

    db.account.balance += type === "DEPOSIT" ? amount : -amount;

    const tx = {
      id: "t" + Date.now(),
      type,
      amount,
      date: new Date().toISOString(),
      description:
        type === "TRANSFER"
          ? "Transfer to " + toEmail
          : type === "DEPOSIT"
          ? "Deposit"
          : "Withdrawal"
    };

    db.txs.unshift(tx);

    return { ok: true, data: tx };
  }
};
