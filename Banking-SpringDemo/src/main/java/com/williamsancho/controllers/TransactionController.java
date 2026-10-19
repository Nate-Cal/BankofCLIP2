package com.williamsancho.controllers;

import com.williamsancho.models.Transaction;
import com.williamsancho.services.AccountService;
import com.williamsancho.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/transaction")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"}, allowedHeaders = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @PutMapping("deposit/{accountId}")
    public ResponseEntity<String> deposit(@RequestHeader("Authorization") String token,
                                          @PathVariable int accountId,
                                          @RequestParam double amount) {

        String response = transactionService.deposit(accountId, amount, token);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("withdraw/{accountId}")
    public ResponseEntity<String> withdrawal(@RequestHeader("Authorization") String token,
                                             @PathVariable int accountId,
                                             @RequestParam double amount) {

        String response = transactionService.withdraw(accountId, amount, token);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PutMapping("transfer/{accountId}")
    public ResponseEntity<String> transfer(@RequestHeader("Authorization") String token,
                                           @PathVariable int accountId,
                                           @RequestParam int transferAccountId,
                                           @RequestParam double amount) {

        String response = transactionService.transfer(accountId, transferAccountId, amount, token);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/transactions/{accountId}")
    public ResponseEntity <List<Transaction>> getAllTransactions(@RequestHeader("Authorization") String token,
                                           @PathVariable int accountId) {

        List<Transaction> transactionList = transactionService.getAllTransactions(token, accountId);
        return ResponseEntity.status(HttpStatus.OK).body(transactionList);

    }



}