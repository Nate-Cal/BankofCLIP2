class BankTransaction {
  constructor() {
    this.balance = 0;
  }

  getBalance() {
    return this.balance;
  }

  deposit(amount) {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Deposit amount must be positive.');
    }
  }

  withdraw(amount) {
    if (amount > 0 && amount <= this.balance) {
      this.balance -= amount;
      console.log(`Withdrew: $${amount}. New balance: $${this.balance}`);
    } else {
      console.log('Withdrawal amount must be positive and less than or equal to the current balance.');
    }
  }
}