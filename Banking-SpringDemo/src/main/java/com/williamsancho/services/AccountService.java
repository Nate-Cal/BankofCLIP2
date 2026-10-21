package com.williamsancho.services;


import com.williamsancho.jwt.JwtUtil;
import com.williamsancho.models.Account;
import com.williamsancho.models.User;
import com.williamsancho.repository.AccountRepository;
import com.williamsancho.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {


    private final AccountRepository accountRepository;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;



    public String createAccount(String token){

        String tokens = token.substring(7).trim();
        Optional<User> user = userRepository.findById(jwtUtil.extractUserId(tokens));
        if(user.isEmpty()){

            return "Unsuccessful please try again later.";

        }
        else{


            User user1 = user.get();
            Account account = new Account();
            account.setAccountBalance(0);
            account.setDate(new Date());
            account.setUser(user1);
            account.setCurrencyType("USD");
            accountRepository.save(account);
        }

        return "Account created. Congratulations.";
    }

    //Good
    public String deleteAccountById(String token, int accountId) {

        String jwt = token.substring(7).trim();
        int userId = jwtUtil.extractUserId(jwt);

        Optional<Account> accounts = accountRepository.findById(accountId);

        if (accounts.isEmpty()) {
            return "No accounts found for this user.";
        }

        Account account = accounts.get();
        accountRepository.delete(account);

        return "Account deleted successfully.";
    }

    public String deleteAllAccounts(String token) {

        String jwt = token.substring(7).trim();
        int userId = jwtUtil.extractUserId(jwt);

        List<Account> accounts = accountRepository.findAllByUserUserId(userId);

        if (accounts.isEmpty()) {
            return "No accounts found for this user.";
        }

        accountRepository.deleteAll(accounts);

        return "All accounts deleted successfully.";
    }



    //Good
    public List<Account> getAllAccountsByUserId(String token) {

        String tokens = token.substring(7).trim();
        int userId = jwtUtil.extractUserId(tokens);

        return accountRepository.findAllByUserUserId(userId);

    }



    public Optional<Account> findAccountByUserId(String token, int accountId) {

        String rawToken = token.substring(7).trim();
        int userId = jwtUtil.extractUserId(rawToken);

        if (!jwtUtil.validateToken(rawToken)) {
            return Optional.empty();
        }

        List<Account> accounts = accountRepository.findAllByUserUserId(userId);

        return accounts.stream()
                .filter(a -> a.getAccountId() == accountId)
                .findFirst();
    }







}


