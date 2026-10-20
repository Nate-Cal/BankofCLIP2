package com.revature.CLIBank.API;
import com.revature.CLIBank.Repository.AccountRepo;
import com.revature.CLIBank.Utility.Money;
import com.revature.CLIBank.model.AccountInfo;
import com.revature.CLIBank.BusinessLogic.BankTransactions;
import java.math.BigDecimal;
import java.util.Scanner ;


public class AccountInterface {
    AccountRepo accountRepo ;
    BankTransactions bankTransactions ;
    //Mo
    public void askDeposit(AccountInfo accountInfo){
        System.out.println("What amount would you like to deposit?");
        Scanner scanner = new Scanner(System.in);

        try {
            String amountStr = scanner.nextLine();

            //checks if user inputted numbers
            BigDecimal amountDecimal = new BigDecimal(amountStr);

            long amount = Money.toCents(amountStr);
            BankTransactions bankTransactions = new BankTransactions();
            long amountDeposited = bankTransactions.deposit(accountInfo, amount);



            if (amountDeposited > 0) {
                String amountDepositedStr = Money.fromCents(amountDeposited);
                System.out.println(amountDepositedStr + " deposited in " + accountInfo.getAccountType() + " account.");
                System.out.println("New balance: " + Money.fromCents(accountInfo.getBalance()));
            }
            else
            {
                System.out.println("Deposit failed.");
            }
        } catch (NumberFormatException ex) {
            System.out.println("Invalid input. Please enter a valid number." + ex.toString());
        }

    }

    //Mo
    public void askWithdraw(AccountInfo accountInfo) {
        System.out.println("What amount would you like to withdraw?");
        Scanner scanner = new Scanner(System.in);

        try {
            String amountStr = scanner.nextLine();
            //checks if user inputted numbers
            BigDecimal amountDecimal = new BigDecimal(amountStr);

            long amount = Money.toCents(amountStr);
            BankTransactions bankTransactions = new BankTransactions();
            long amountWithdrawn = bankTransactions.withdraw(accountInfo, amount);



            if (amountWithdrawn > 0) {
                String amountWithdrawnStr = Money.fromCents(amountWithdrawn);
                System.out.println(amountWithdrawnStr + " withdrawn from " + accountInfo.getAccountType() + " account.");
                System.out.println("New Balance: " + Money.fromCents(accountInfo.getBalance()));
            }
            else
            {
                System.out.println("Withdrawal failed.");
            }
            } catch(NumberFormatException ex){
                System.out.println("Invalid input. Please enter a valid number.");
            }

        }


    //Mo
    public void askTransfer(AccountInfo sendingAccount, AccountInfo receivingAccount) {
        System.out.println("Enter the transfer amount.");
        Scanner scanner = new Scanner(System.in);

        try {
            String amountStr = scanner.nextLine();

            //checks if user inputted numbers
            BigDecimal amountDecimal = new BigDecimal(amountStr);

            long amount = Money.toCents(amountStr);
            //bankTransactions = new BankTransactions();
            long amountTransferred = bankTransactions.transfer(sendingAccount, receivingAccount, amount);

            if (amountTransferred > 0) {
                String amountTransferredStr = Money.fromCents(amountTransferred);
                System.out.println(amountTransferredStr + " transferred from " + sendingAccount.getAccountType() + " account ");
                System.out.println(sendingAccount.getAccountType() + " account balance:  " + Money.fromCents(sendingAccount.getBalance()));
                System.out.println(receivingAccount.getAccountType() + " account balance:  " + Money.fromCents(receivingAccount.getBalance()));

            }
            else
            {
                System.out.println("Transfer failed.");
            }
        } catch (NumberFormatException ex) {
            System.out.println("Invalid input. Please enter a valid number.");
        }

    }

    public AccountRepo getAccountRepo() {
        return accountRepo;
    }

    public void setAccountRepo(AccountRepo accountRepo) {
        this.accountRepo = accountRepo;
    }

    public BankTransactions getBankTransactions() {
        return bankTransactions;
    }

    public void setBankTransactions(BankTransactions bankTransactions) {
        this.bankTransactions = bankTransactions;
    }
}






