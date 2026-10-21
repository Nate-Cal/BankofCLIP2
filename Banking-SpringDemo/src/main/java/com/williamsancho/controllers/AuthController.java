package com.williamsancho.controllers;


import com.williamsancho.jwt.JwtUtil;
import com.williamsancho.models.LoginDTO;
import com.williamsancho.models.User;
import com.williamsancho.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:4200"}, allowedHeaders = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String token){

        List<User> allUsers= userService.getAllUsers(token);
        return ResponseEntity.status(201).body(allUsers);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> GetUserById(@RequestHeader("Authorization") String token,
                                               @PathVariable int userId){

        return ResponseEntity.status(200).body(userService.getUserById(token, userId));
    }
}