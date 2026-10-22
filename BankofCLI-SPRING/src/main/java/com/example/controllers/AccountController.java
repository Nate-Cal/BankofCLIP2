package com.example.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.BankofCLI.models.Account;

@Controller
@RequestMapping("/Account")
public class AccountController {
	
	@PostMapping("/add")
	public ResponseEntity<Account> insertAccount(@RequestBody Account tobeAdded, @RequestHeader("Authorization") String token){
		return;
	}
	
	@GetMapping("/get")
	public ResponseEntity<Account> getAccount(@RequestBody Account account, @RequestHeader("Authorization") String token){
		return;
	}
	
	@GetMapping("/getAll")
	public ResponseEntity<List<Account>> getAccountsByUser(@RequestHeader("Authorization") String token){
		return;
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteAccount(@RequestBody Account account){
		return;
	}
	
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e){
        
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
