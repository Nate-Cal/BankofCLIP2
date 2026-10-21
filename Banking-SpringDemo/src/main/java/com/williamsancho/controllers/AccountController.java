package com.williamsancho.controllers;


import com.williamsancho.models.Account;
import com.williamsancho.services.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"}, allowedHeaders = "*")
public class AccountController {

    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<String> createAccount(@RequestHeader("Authorization") String token){

        return ResponseEntity.ok(accountService.createAccount(token));
    }

    @DeleteMapping("/delete/{accountId}")
    public ResponseEntity<String> deleteAccountById(@RequestHeader("Authorization") String token,
                                                    @PathVariable int accountId){

        return ResponseEntity.ok(accountService.deleteAccountById(token, accountId));
    }

    @DeleteMapping("/deleteAll")
    public ResponseEntity<String> deleteAllAccounts(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(accountService.deleteAllAccounts(token));
    }


    @GetMapping("/accounts")
    public ResponseEntity<List<Account>>getAllAccountsByUserId(@RequestHeader("Authorization") String token){

        return ResponseEntity.ok(accountService.getAllAccountsByUserId(token));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getAccountByUserId(@RequestHeader("Authorization") String token,
                                                @PathVariable int accountId){

        Optional<Account> accountOpt = accountService.findAccountByUserId(token, accountId);

        if (accountOpt.isEmpty()) {
            // But now you STILL can't tell invalid token vs not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not found");
        }

        return ResponseEntity.ok(accountOpt.get());
    }


}
