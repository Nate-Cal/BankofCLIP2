class BankAccount {
    #balance;
  
    constructor(accountNumber, accountHolder, balance) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.#balance = balance;
  }

  getBalance() {
    return this.#balance;
  }

  setBalance(newBalance) {
    if (newBalance >= 0) {
      this.balance = newBalance;
      console.log(`Balance updated to: $${this.balance}`);
    } else {
      console.log('Balance cannot be negative.');
    }
  }

  setAccountHolder(newHolder) {
    this.accountHolder = newHolder;
    console.log(`Account holder updated to: ${this.accountHolder}`);
  }


}

module.exports = BankAccount;