// import { useState } from 'react';

// function Account() {

//     const [balance, setBalance] = useState(0);

//     const handleDeposit = (amount: number) => {
//         setBalance(balance + amount);
//     };

//     const handleWithdraw = (amount: number) => {
//         if (amount <= balance) {
//             setBalance(balance - amount);
//         } else {
//             alert('Insufficient funds');
//         }
//     };

//     return (
//         <div>
//             <h1>Account Balance: ${balance}</h1>
//             <button onClick={() => handleDeposit(100)}>Deposit $100</button>
//             <button onClick={() => handleWithdraw(50)}>Withdraw $50</button>
//         </div>
//     );
// }

// export default Account;

import { useState } from 'react'
import './Account.css'

function Account() {
  const [balance, setBalance] = useState(0)

  function handleDeposit(amount: number) {
    setBalance(balance + amount)
  }

  function handleWithdraw(amount: number) {
    if (amount <= balance) {
      setBalance(balance - amount)
    } else {
      alert('Insufficient funds')
    }
  }

  return (
    <div className="flex-col">

        <div className="itemHeader">
            <h1>Account Menu</h1>

            <button type="button" onClick={() => window.location.href = '/'}>
                Home
            </button>
        </div>

      <div className="item grow-main">
        <p>
          Welcome to your account! Here you can view your current balance and perform transactions.
        </p>

        <h2>Account Balance: ${balance}</h2>

        <p>Quick Actions:</p>
        <button onClick={() => handleDeposit(100)}>
            Deposit $100
        </button>

        <button onClick={() => handleWithdraw(50)}>
            Withdraw $50
        </button>

        <div className="transaction-section">
            <h3>Custom Transaction</h3>
            <label htmlFor="customAmount">Amount:</label>
            <input type="number" id="customAmount" name="customAmount" />

            <button onClick={() => {
                const amountInput = document.getElementById('customAmount') as HTMLInputElement
                const amount = parseFloat(amountInput.value)
                if (!isNaN(amount)) {
                    handleDeposit(amount)
                }
            }}>
                Deposit Custom Amount
            </button>

            <button onClick={() => {
                const amountInput = document.getElementById('customAmount') as HTMLInputElement
                const amount = parseFloat(amountInput.value)
                if (!isNaN(amount)) {
                    handleWithdraw(amount)
                }
            }}>
                Withdraw Custom Amount
            </button>
        </div>

      </div>

      <div className="itemFooter">
        <p>&copy; 2026 Bank of CLI. All rights reserved.</p>
        <p><a href="/meettheteam">Connect With Us</a></p>
      </div>    
      
    </div>
  )
}

export default Account