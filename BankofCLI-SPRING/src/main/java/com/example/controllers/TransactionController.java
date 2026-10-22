package com.example.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.BankofCLI.models.Account;
import com.example.BankofCLI.models.Transaction;

@Controller
@RequestMapping("/transaction")
@CrossOrigin(origins = {"http://localhost:5173"}, allowedHeaders = "*")
public class TransactionController {

	@PutMapping("/deposit/{accountId}?amount={amount}")
	public ResponseEntity<?> deposit(@RequestHeader("Authorization") String token,@RequestParam(required = true) float amount){
		return ResponseEntity.ok().body(null);
	}
	@PutMapping("/withdraw{accountId}?amount={amount}")
	public ResponseEntity<?> withdraw(@RequestHeader("Authorization") String token,@RequestParam(required = true) float amount){
		return ResponseEntity.ok().body(null);
	}
	@PutMapping("/transfer/{accountId}?transferAccountId={destinationAccountId}&amount={amount}")
	public ResponseEntity<?> transfer(@RequestParam(required = true) Account destinationAccountId, @RequestHeader("Authorization") String token,@RequestParam(required = true) float amount){
		return ResponseEntity.ok().body(null);
	}
	@GetMapping("/transactions/{accountId}")
	public ResponseEntity<List<Transaction>> getTransactions(@PathVariable UUID accountId){
		//service here
		return ResponseEntity.ok().body(null);
	}
	
	
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e){
        
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
