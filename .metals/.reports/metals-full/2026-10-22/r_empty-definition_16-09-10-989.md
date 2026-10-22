error id: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/ServiceMapper.java:com/example/service/ServiceMapper#
file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/ServiceMapper.java
empty definition using pc, found symbol in pc: 
found definition using semanticdb; symbol com/example/service/ServiceMapper#
empty definition using fallback
non-local guesses:

offset: 155
uri: file:///C:/Repos/BankofCLIP2/BankofCLI-SPRING/src/main/java/com/example/service/ServiceMapper.java
text:
```scala
package com.example.service;

import com.example.service.contract.BankContracts.*;
import com.bankofcli.service.port.BankData.*;

final class ServiceMapper@@ {
    private ServiceMapper() {}

    static UserIdentity identity(UserData user) {
        return new UserIdentity(user.userId(), user.firstName(), user.lastName(), user.email(), user.role());
    }

    static AccountResponse account(AccountData account) {
        return new AccountResponse(account.accountId(), new UserReference(account.userId()), account.currency(),
                account.balance(), account.type(), account.name());
    }

    static TransactionResponse transaction(TransactionData entry) {
        return new TransactionResponse(entry.transactionId(), new AccountReference(entry.accountId()),
                entry.type(), entry.amount(), entry.date().toString(), entry.description());
    }
}

```


#### Short summary: 

empty definition using pc, found symbol in pc: 