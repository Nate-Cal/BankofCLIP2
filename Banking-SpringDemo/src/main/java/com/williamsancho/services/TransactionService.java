package com.williamsancho.services;

import com.williamsancho.exceptions.InsufficientFundsException;
import com.williamsancho.jwt.JwtUtil;
import com.williamsancho.models.Account;
import com.williamsancho.models.Transaction;
import com.williamsancho.repository.AccountRepository;
import com.williamsancho.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    public final TransactionRepository transactionRepository;
    public final AccountRepository accountRepository;
    public final JwtUtil jwtUtil;


    public String deposit(int accountId, double amount, String token) {

        String tokens = token.substring(7).trim();
        if (!jwtUtil.validateToken(tokens)) {
            return "Token is invalid, cannot process transaction";
        }
        Optional<Account> optAccount = accountRepository.findById(accountId);

        if(optAccount.isEmpty()){

            return "Unable to locate account.";
        }
        Account account = optAccount.get();
        if (account.getAccountBalance() < 1) {
            throw new InsufficientFundsException("Amount must be at least $1");
        }
        account.setAccountBalance(account.getAccountBalance() + amount);
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType("DEPOSIT");
        transaction.setDate(new Date());
        transaction.setAmount(String.valueOf(amount));
        transaction.setDescription("");
        accountRepository.save(account);
        transactionRepository.save(transaction);

        return "Deposit of $" + amount + " was successful. " +
                "Thank you for banking with us.";
    }


    public String withdraw(int accountId, double amount, String token) {
        Optional<Account> optAccount = accountRepository.findById(accountId);

        if(optAccount.isEmpty()){

            return "Unable to locate account.";
        }

        Account account = optAccount.get();
        if (account.getAccountBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds");
        }

        if (account.getAccountBalance() < 1) {
            throw new InsufficientFundsException("Amount must be at least $1");
        }


        account.setAccountBalance(account.getAccountBalance()  - amount);
        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setType("WITHDRAWAL");
        transaction.setDate(new Date());
        transaction.setAmount(String.valueOf(amount));
        transaction.setDescription("");
        accountRepository.save(account);
        transactionRepository.save(transaction);

        return "Withdrawal of $" + amount + " was successful. " +
                "Thank you for banking with us.";
    }

    public String transfer(int senderAccountId, int receiverAccountId, double amount, String token) {

        String tokens = token.substring(7).trim();
        boolean validateToken = jwtUtil.validateToken(tokens);
        if(!validateToken){

            return "Unable to complete transfer at time. Please try again.";

        }
        int userId = jwtUtil.extractUserId(tokens);
        List<Account> accounts = accountRepository.findAllByUserUserId(userId);
        Optional<Account> account = accounts.stream()
                .filter(a -> a.getAccountId() == senderAccountId)
                .findFirst();

            if(account.isEmpty()){

                return "Cannot find account number " + senderAccountId;

            }

            Account sendy = account.get();
        sendy.setAccountBalance(sendy.getAccountBalance() - amount);
        if (sendy.getAccountBalance() < amount) {
            throw new InsufficientFundsException("Insufficient funds");
        }

        if (sendy.getAccountBalance() < 1) {
            throw new InsufficientFundsException("Amount must be at least $1");
        }

        List<Account> allAccounts = accountRepository.findAll().stream().toList();
        Optional<Account> accountList = allAccounts.stream()
                .filter(a -> a.getAccountId() == receiverAccountId)
                .findFirst();

        if(accountList.isEmpty()){

            return "Cannot find account number " + receiverAccountId;

        }

        Account recievy = accountList.get();
        recievy.setAccountBalance(recievy.getAccountBalance() + amount);
        Transaction transaction = new Transaction();
        transaction.setAccount(sendy);
        transaction.setType("TRANSFER/WITHDRAWAL");
        transaction.setDate(new Date());
        transaction.setAmount(String.valueOf(amount));
        transaction.setDescription("");
        accountRepository.save(sendy);
        transactionRepository.save(transaction);
        Transaction transaction2 = new Transaction();
        transaction2.setAccount(sendy);
        transaction2.setType("TRANSFER/DEPOSIT");
        transaction2.setDate(new Date());
        transaction2.setAmount(String.valueOf(amount));
        transaction2.setDescription("");
        accountRepository.save(recievy);
        transactionRepository.save(transaction2);

        return "transfer was successful";



    }

    public List<Transaction> getAllTransactions(String token, int accountId){


        String tokens = token.substring(7).trim();
        boolean validateToken = jwtUtil.validateToken(tokens);
        if(!validateToken){

            return new ArrayList<>();

        }
        return transactionRepository.findAllByAccountAccountId(accountId);
    }

}
