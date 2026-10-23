package com.example.BankofCLI.repositories;

import com.example.BankofCLI.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    /* The Account class is dependent on the User class.
    findAllByUserUserId gets the user id from the account dataset and returns all
    accounts that corresponds with it.*/
    List<Account> findAllByUserUserId(int userId);


}
