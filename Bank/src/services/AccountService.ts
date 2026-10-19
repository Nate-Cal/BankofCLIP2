
import {Service} from "./Services";

export default class AccountService extends Service {

    async getAccount(){
        await this.wait(700); return { ok: true, data: { ...this.db.account } };
    }

    async getTransactions(){
        await this.wait(900); return { ok: true, data: [...this.db.txs] };
    }

    async submit(type:string, amount:number, toEmail:string){
        await this.wait();
        if (type !== "DEPOSIT" && amount > this.db.account.balance)
        return this.fail("INSUFFICIENT_FUNDS", "Not enough funds for this transaction.");
        this.db.account.balance += type === "DEPOSIT" ? amount : -amount;
        const tx = { id: "t" + Date.now(), type, amount, date: new Date().toISOString(),
        description: type === "TRANSFER" ? "Transfer to " + toEmail : type === "DEPOSIT" ? "Deposit" : "Withdrawal" };
        this.db.txs.unshift(tx);
        return { ok: true, data: tx };
    }

}