# Section 5: use of the shared contracts

Section 1 remains the source of truth. This dashboard adds no domain types.

- `src/types.ts` supplies `Account`, `Transaction`, and `TransactionType`.
- `src/contracts/account.ts` supplies `GetAccountResponse` (`ApiResult<Account>`).
- `src/contracts/transactions.ts` supplies `GetTransactionsResponse` (`ApiResult<Transaction[]>`).

The page calls `getAccount()` and `getTransactions()` together. It checks `ok`
and the presence of `data` before rendering. An API error or rejected promise
shows feedback with a retry button. An empty transaction array is supported.

`mocks/dashboard.json` stores the two responses under `account` and
`transactions`; the service returns each response separately. This wrapper is
only for organizing the mock file, not a new backend response contract.

Account money uses `balance` in dollars, and transaction money uses `amount`
in dollars. Dates come from `date`. The shared transaction values are
`DEPOSIT`, `WITHDRAW`, and `TRANSFER`. Deposits display as positive; withdrawals
and outgoing transfers display as negative, following the HTML demo.

The account footer displays `account.id`, since the shared Account does not
include a separate account number or `lastFour` field. The card layout and
styling are unchanged.

The page calls services; BalanceCard and TransactionList only receive props.
Pass a service with the same two methods using `<Dashboard service={accountService} />`.
Increment `refreshKey` after a successful transaction to reload Section 5.
