package com.example.BankofCLI.models;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String ownerId;
    private String name;
    private double balance; // Matches your frontend mock JSON (dollars)
    private String currency = "USD";
    private String mask;

    public Account() {}
    public Account(String ownerId, String name, double balance, String mask) {
        this.ownerId = ownerId;
        this.name = name;
        this.balance = balance;
        this.mask = mask;
    }

    // Getters & Setters
    public String getId() { return id; }
    public String getOwnerId() { return ownerId; }
    public String getName() { return name; }
    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
    public String getCurrency() { return currency; }
    public String getMask() { return mask; }
}
