error id: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/BankData.java:
file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/BankData.java
empty definition using pc, found symbol in pc: 
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 246
uri: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/BankData.java
text:
```scala
package com.example.service.port;

import com.example.service.contract.BankContracts.AccountType;
import java.math.BigDecimal;
import java.time.Instant;

/** Immutable values exchanged with repository adapters; these are not JPA models. */
public@@ final class BankData {
    private BankData() {}

    public record UserData(String userId, String firstName, String lastName, String email,
                           String passwordHash, String role) {
        @Override public String toString() { return "UserData[credentials redacted]"; }
    }

    public record AccountData(String accountId, String userId, String name, AccountType type,
                              BigDecimal balance, String currency) {}

    public record TransactionData(String transactionId, String accountId, String type,
                                  BigDecimal amount, Instant date, String description) {}
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: 