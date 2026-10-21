package com.example.BankofCLI.models;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String accountId;
    private String type; // DEPOSIT, WITHDRAW, TRANSFER
    private double amount;
    private String date;
    private String description;

    public Transaction() {}
    public Transaction(String accountId, String type, double amount, String description) {
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.date = Instant.now().toString();
        this.description = description;
    }

    // Getters
    public String getId() { return id; }
    public String getAccountId() { return accountId; }
    public String getType() { return type; }
    public double getAmount() { return amount; }
    public String getDate() { return date; }
    public String getDescription() { return description; }
}
