package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.BankofCLI.models.LoginDTO;
import com.example.BankofCLI.models.User;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody LoginDTO dto){
		return;
	}
	
	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody User newUser){
		return;
	}
	
	
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e){
        
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
