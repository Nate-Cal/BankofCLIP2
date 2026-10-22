error id: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/UserStore.java:_empty_/UserData#
file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/UserStore.java
empty definition using pc, found symbol in pc: _empty_/UserData#
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 258
uri: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/UserStore.java
text:
```scala
package com.example.service.port;

import com.example.service.port.BankData.UserData;
import java.util.Optional;

/** Implement using the team's repository, participating in the service's Spring transaction. */
public interface UserStore {
    Optional<UserD@@ata> findById(String userId);
    Optional<UserData> findByEmail(String normalizedEmail);

    /**
     * Persist a new USER, assign its ID and return its saved values.
     * Enforce normalized-email uniqueness in the database, including concurrent inserts.
     * Translate only duplicate-email failures to DuplicateEmailException.
     */
    UserData create(String firstName, String lastName, String normalizedEmail, String passwordHash);

    class DuplicateEmailException extends RuntimeException {
        public DuplicateEmailException(Throwable cause) { super("Email already exists.", cause); }
    }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: _empty_/UserData#