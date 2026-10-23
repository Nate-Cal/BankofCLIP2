package com.example.repositories;

import com.example.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    //Use this for validating if email is unique and distinct.
    Optional<User> findByEmail(String email);

    //Use this in the login method.
    // Optional<User> findByEmailAndPassword(String email, String Password);
}
