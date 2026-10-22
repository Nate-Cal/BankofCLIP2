package com.example.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.BankofCLI.models.Account;
import com.example.JWT.JwtUtil;

@Controller
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:5173"}, allowedHeaders = "*")
public class AccountController {
	
	private final JwtUtil jwt;
	
	@PostMapping("/addAccount")
	public ResponseEntity<Account> insertAccount(@RequestBody Account tobeAdded, @RequestHeader("Authorization") String token){
		return ResponseEntity.status(201).body(null);
	}
	
	@GetMapping("/getAccount")
	public ResponseEntity<Account> getAccount(@RequestBody Account account, @RequestHeader("Authorization") String token){
		return ResponseEntity.ok(account);
	}
	
	@GetMapping("/accounts")
	public ResponseEntity<List<Account>> getAccountsByUser(@RequestHeader("Authorization") String token){
		//Service logic here
		return ResponseEntity.ok().body(null);
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteAccount(@RequestBody Account account){
		return ResponseEntity.ok().body(null);
	}
	
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e){
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
