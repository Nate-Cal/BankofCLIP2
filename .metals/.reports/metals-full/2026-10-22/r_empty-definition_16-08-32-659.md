error id: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/TransactionStore.java:
file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/TransactionStore.java
empty definition using pc, found symbol in pc: 
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 283
uri: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/port/TransactionStore.java
text:
```scala
package com.example.service.port;

import com.bankofcli.service.port.BankData.TransactionData;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** History writes must use the same database transaction as the account balance updates. */
public interface@@ TransactionStore {
    List<TransactionData> findByAccountId(String accountId);

    void record(String accountId, String type, BigDecimal amount, Instant date, String description);
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: 