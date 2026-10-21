package com.williamsancho.controllers;


import com.williamsancho.jwt.JwtUtil;
import com.williamsancho.models.AuthResponse;
import com.williamsancho.models.LoginDTO;
import com.williamsancho.models.User;
import com.williamsancho.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"}, allowedHeaders = "*")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerNewUser(@RequestBody User user){
        try {
            User registeredUser = userService.registerNewUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createAuthResponse(registeredUser));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO loginDto){
        try {
            User user = userService.loginUser(loginDto.getEmail(), loginDto.getPassword());
            return ResponseEntity.ok(createAuthResponse(user));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", exception.getMessage()));
        }
    }

    private AuthResponse createAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getName(), user.getRole(), user.getUserId());
        return new AuthResponse(String.valueOf(user.getUserId()), user.getName(), user.getEmail(), token);
    }
}
