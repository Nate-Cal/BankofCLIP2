# Section 5 dashboard contract

The existing interfaces in `../models/banking.ts` are the source of truth.
`DashboardService.getDashboard()` returns `Promise<DashboardResponse>` with
`user`, `accounts`, and `transactions`. See `../mocks/dashboard.json` for the
complete example response adapted from the HTML demo.

- Money is integer cents: `428050` displays as `$4,280.50`.
- Transactions use `WITHDRAWAL`, as defined in the existing model.
- `direction` sets the displayed sign: `CREDIT` is positive, `DEBIT` negative.
- Dates are ISO 8601 strings in `createdAt`, displayed in the user's local time.
- Transactions arrive in newest-first order.
- Empty account and transaction arrays are supported.
- A rejected service promise displays an error and retry button.

The page calls the service. BalanceCard and TransactionList only receive props.
Connect the team's service with `<Dashboard service={bankService} />`; it needs
only the existing `getDashboard()` method. Increment the optional `refreshKey`
prop after a successful transaction to reload the dashboard.
