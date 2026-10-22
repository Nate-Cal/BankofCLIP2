package com.example.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.BankofCLI.models.LoginDTO;
import com.example.BankofCLI.models.User;
import com.example.JWT.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173"}, allowedHeaders = "*")
public class AuthController {
	
	private final JwtUtil jwt;

	public AuthController(JwtUtil jwt) {
		this.jwt = jwt;
	}

	public ResponseEntity<String> login(@RequestBody LoginDTO dto){
		
		User loggedin; // some service login method
		String token = jwt.generateToken(loggedin);
		return ResponseEntity.ok(token);
	}
	
	@PostMapping("/register")
	public ResponseEntity<User> register(@RequestBody User newUser){
		//some service register method
		return ResponseEntity.status(201).body(newUser);
	}
	
	
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e){
        
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
