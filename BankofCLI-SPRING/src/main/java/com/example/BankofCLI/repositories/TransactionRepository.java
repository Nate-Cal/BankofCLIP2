package com.example.BankofCLI.repositories;


import com.example.BankofCLI.models.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    /*Transaction class is dependent on Account class which is dependent on the
    User class. findAllByAccountAccountId gets the account id from the transactions
    dataset and returns all transactions corresponding with it. */
    List<Transaction> findAllByAccountAccountId(int accountId);
}
