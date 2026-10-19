package com.revature.CLIBank.API;

import com.revature.CLIBank.BusinessLogic.BankTransactions;
import com.revature.CLIBank.Repository.AccountRepo;
import com.revature.CLIBank.model.AccountInfo;
import com.revature.CLIBank.model.AccountType;
import com.revature.CLIBank.model.User;
import org.junit.jupiter.api.Test;
import java.io.ByteArrayInputStream;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class AccountInterfaceTest {
    private final java.io.InputStream originalInput = System.in;
    @org.junit.jupiter.api.AfterEach void restoreInput() { System.setIn(originalInput); }
    @org.junit.jupiter.api.BeforeEach void schema() { new AccountRepo().initSchema(); }


    @Test
    void askDepositPositive() {
        AccountInfo account = new AccountInfo(UUID.randomUUID(), 1234);
        account.setBalance(1000L);
        account.setFrozen(false);

        com.revature.CLIBank.TestAccounts.save(account);
        System.setIn(new ByteArrayInputStream("25.00\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();
        accountInterface.askDeposit(account);

        assertEquals(3500L, account.getBalance());
    }

    @Test
    void askDepositNegative() {
        AccountInfo account = new AccountInfo(UUID.randomUUID(), 1234);
        account.setBalance(1000L);
        account.setFrozen(false);

        System.setIn(new ByteArrayInputStream("-25.00\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();
        accountInterface.askDeposit(account);

        assertEquals(1000L, account.getBalance());
    }

    @Test
    void askDepositInvalidInput() {
        AccountInfo account = new AccountInfo(UUID.randomUUID(), 1234);
        account.setBalance(1000L);
        account.setFrozen(false);

        System.setIn(new ByteArrayInputStream("abc\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();
        accountInterface.askDeposit(account);

        assertEquals(1000L, account.getBalance());
    }

    @Test
    void askWithdrawPositive() {
        AccountInfo account = new AccountInfo(UUID.randomUUID(), 1234);
        account.setBalance(3500L);
        account.setFrozen(false);

        com.revature.CLIBank.TestAccounts.save(account);
        System.setIn(new ByteArrayInputStream("25.00\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();
        accountInterface.askWithdraw(account);

        assertEquals(1000L, account.getBalance());
    }


    @Test
    void askWithdrawNegative() {
        AccountInfo account = new AccountInfo(UUID.randomUUID(), 1234);
        account.setBalance(1000L);
        account.setFrozen(false);

        System.setIn(new ByteArrayInputStream("25.00\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();
        accountInterface.askWithdraw(account);

        assertEquals(1000L, account.getBalance());
    }

    @Test
    void askTransferPositive() {

        AccountRepo accountRepo = new AccountRepo();
        User user = new User("Owner67", 45, "Pass1234!");
        accountRepo.insertUser(user);

        AccountInfo sendingAccount = new AccountInfo(UUID.randomUUID(), user.getUserID(), 1001, AccountType.CHECKING, 10000L, false);
        sendingAccount.setBalance(7500L);
        sendingAccount.setFrozen(false);

        AccountInfo receivingAccount = new AccountInfo(UUID.randomUUID(), user.getUserID(), 1002, AccountType.SAVINGS, 0L, false);

        receivingAccount.setBalance(1500L);
        receivingAccount.setFrozen(false);
        AccountRepo.insertAccount(sendingAccount);
        AccountRepo.insertAccount(receivingAccount);

        System.setIn(new ByteArrayInputStream("30.00\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();
        BankTransactions bankTransactions = new BankTransactions() ;
        bankTransactions.setAccountRepo(accountRepo);
        accountInterface.setBankTransactions(bankTransactions);
        accountInterface.askTransfer(sendingAccount, receivingAccount);

        assertEquals(4500L, sendingAccount.getBalance());
        assertEquals(4500L, receivingAccount.getBalance());
    }

    @Test
    void askTransferNegative() {
        AccountInfo sendingAccount = new AccountInfo(UUID.randomUUID(), 1234);
        sendingAccount.setBalance(2000L);
        sendingAccount.setFrozen(false);

        AccountInfo receivingAccount = new AccountInfo(UUID.randomUUID(), 4321);
        receivingAccount.setBalance(3000L);
        receivingAccount.setFrozen(false);

        System.setIn(new ByteArrayInputStream("50.00\n".getBytes()));

        AccountInterface accountInterface = new AccountInterface();

        // Supply the transaction helper, as the positive transfer test already does
        accountInterface.setBankTransactions(new BankTransactions());

        accountInterface.askTransfer(sendingAccount, receivingAccount);

        assertEquals(2000L, sendingAccount.getBalance());
        assertEquals(3000L, receivingAccount.getBalance());
    }
}