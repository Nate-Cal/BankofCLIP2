package com.example.repositories;

import com.example.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {

    /* The Account class is dependent on the User class.
    findAllByUserUserId gets the user id from the account dataset and returns all
    accounts that corresponds with it.*/
    // List<Account> findAllByUserUserId(int userId);

    List<Account> findByUserId(String userId);
    
    Optional<Account> findByIdAndUserId(String id, String userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    
    @Query("select a from Account a where a.id = :id and a.userId = :userId")
    
    Optional<Account> lockByIdAndUserId(@Param("id") String id, @Param("userId") String userId);


}
