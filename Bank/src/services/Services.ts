
export abstract class Service{
    wait = (ms = 900) => new Promise(r => setTimeout(r, ms));   // fake server delay
    fail = (code:String, message:String) => ({ ok: false, error: { code, message } });

    db = {   // fake database
    user: { id: "u1", name: "Slagathor", email: "slagathor@bankofcli.dev" },
    account: { id: "a1", ownerId: "u1", balance: 4280.5, currency: "USD" },
    txs: [
        { id: "t3", type: "DEPOSIT", amount: 1200, date: "2026-09-25T10:00:00Z", description: "Paycheck" },
        { id: "t2", type: "WITHDRAW", amount: 60, date: "2026-09-24T18:30:00Z", description: "ATM withdrawal" },
        { id: "t1", type: "TRANSFER", amount: 250, date: "2026-09-22T09:15:00Z", description: "Transfer to sonic@hedgehog.com" }
    ]
    };

}

