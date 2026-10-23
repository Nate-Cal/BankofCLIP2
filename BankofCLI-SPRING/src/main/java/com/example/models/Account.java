package com.example.models;

import jakarta.persistence.*;

@Entity
@Table(name = "accounts")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false)
    private String userId;
    private String name;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal balance;
    // private double balance; // Matches your frontend mock JSON (dollars)
    private String currency = "USD";
    private String mask;
    @Enumerate(EnumType.STRING)
    private AccountType type;

    public Account() {}
    public Account(String userId, String name, BigDecimal balance) {
        this.userId = ownerId;
        this.name = name;
        this.balance = balance;
    }

    // Getters & Setters
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public double getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public String getCurrency() { return currency; }
    public String getMask() { return mask; }
}
