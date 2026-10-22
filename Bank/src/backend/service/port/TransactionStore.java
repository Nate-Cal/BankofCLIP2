package com.bankofcli.service.port;

import com.bankofcli.service.port.BankData.TransactionData;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/** History writes must use the same database transaction as the account balance updates. */
public interface TransactionStore {
    List<TransactionData> findByAccountId(String accountId);

    void record(String accountId, String type, BigDecimal amount, Instant date, String description);
}
