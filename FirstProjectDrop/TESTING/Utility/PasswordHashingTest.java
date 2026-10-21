package com.revature.CLIBank.Utility;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordHashingTest {

    @Test
    void passwordCanBeHashedAndVerified() {
        String password = "TestPassword123!";

        String hashedPassword = PasswordHashing.hashPassword(password);

        assertNotEquals(password, hashedPassword);
        assertTrue(PasswordHashing.checkPassword(password, hashedPassword));
        assertFalse(PasswordHashing.checkPassword("WrongPassword123!", hashedPassword));
    }
}