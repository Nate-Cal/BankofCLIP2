package com.williamsancho.services;

import com.williamsancho.jwt.JwtUtil;
import com.williamsancho.models.User;
import com.williamsancho.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public User registerNewUser(User newUser) {

        if(newUser.getName() == null || newUser.getName().isBlank()){
            throw new IllegalArgumentException("Name must be present.");
        }

        if(newUser.getEmail() == null || newUser.getEmail().isBlank()){
            throw new IllegalArgumentException("Email must be present.");
        }

        if(newUser.getPassword() == null || newUser.getPassword().isBlank()){
            throw new IllegalArgumentException("Password must be present.");
        }

        Optional<User> optionalUser = userRepository.findByEmail(newUser.getEmail());
        if(optionalUser.isPresent()){
            throw new IllegalArgumentException("Email already registered.");
        }

        if(newUser.getRole() == null || newUser.getRole().isBlank()){
            newUser.setRole("user");
        }

        return userRepository.save(newUser);
    }

    public User loginUser(String email, String password){

        if(email == null || email.isBlank()){
            throw new IllegalArgumentException("Email must be present.");
        }
        if(password == null || password.isBlank()){
            throw new IllegalArgumentException("Password must be present.");
        }

        Optional<User> optionalUser = userRepository.findByEmailAndPassword(email, password);
        if(optionalUser.isEmpty()){

            throw new IllegalArgumentException("Invalid Credentials!");

        }

        return optionalUser.get();

    }

    public List<User> getAllUsers(String token) {

        String tokens = token.substring(7).trim();
        if (!jwtUtil.validateToken(tokens)) {
            return null;
        }

        return userRepository.findAll().stream().toList();

    }

    public User getUserById(String token, int userId) {

        String tokens = token.substring(7).trim();
        if (!jwtUtil.validateToken(tokens)) {
            return null;
        }

        return userRepository.findById(userId)
                .orElse(null);
    }



    public String deleteUserById(String token){

        String tokens = token.substring(7).trim();
        Optional<User> user = userRepository.findById(jwtUtil.extractUserId(tokens));
        if(user.isPresent()){
            userRepository.deleteAllById(Collections.singleton(jwtUtil.extractUserId(token)));
        }

        return "User is removed from database.";
    }


}
