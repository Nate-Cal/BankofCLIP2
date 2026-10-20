package com.revature.CLIBank.API;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.UUID;

public class APITest {
    private final String charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private String randomUname() {
        StringBuilder uname = new StringBuilder("A");
        for(int i = 0; i < 15; i++) {
            uname.append(charset.charAt((int) (charset.length() * Math.random())));
        }
        return uname.toString();
    }

    private String randomPass() {
        StringBuilder pw = new StringBuilder("Aa@1");
        for(int i = 0; i < 13; i++) {
            pw.append(charset.charAt((int) (charset.length() * Math.random())));
        }
        return pw.toString();
    }

    @Test
    public void login_fail_badcreds() {
        API api = new API();
        /* Bad username, bad password that do not meet standards */
        Assertions.assertFalse(api.login("username", "password"));
    }

    /**
     * Test login when there are credentials that pass the
     * requirements but do not exist within the database.
     *
     * This test randomly generates usernames and passwords.
     * It is not absolutely guaranteed to work, but it does
     * with a high probability.
     *
     * @author Nicholas DiGirolamo
     */
    @Test
    public void login_fail_goodcreds() {
        API api = new API();

        Assertions.assertFalse(api.login(randomUname(), randomPass()));
    }

    @Test
    public void login_fail_empty() {
        API api = new API();

        api.login("", "Pa$$w0rdPassw0rd");
        Assertions.assertEquals("Please enter a username", api.getResult());
    }

    @Test
    public void zeroTransactions() {
       API api = new API();

       api.getAcctTransactions(null, 0);
       Assertions.assertTrue(api.getResult().isEmpty());
    }

    /**
     * This program does not support mill (1/1000 dollar).
     * The API truncates numbers after the decimal point to
     * two decimal positions.
     */
    @Test
    public void moneyMill() {
        API api = new API();

        long intended = 12345L;
        Assertions.assertEquals(intended, api.parseMoney("$123.456789"));
    }

    @Test
    public void negativeCents() {
        API api = new API();
        Assertions.assertEquals(Long.MIN_VALUE, api.parseMoney("100.-10"));
    }

    @Test
    public void dollarAmountEquality() {
        API api = new API();

        long intended = 10000L;
        long amt0 = api.parseMoney("100.00");
        long amt1 = api.parseMoney("$100");

        Assertions.assertNotEquals(0L, amt0);
        Assertions.assertEquals(intended, amt0);
        Assertions.assertEquals(intended, amt1);
        Assertions.assertEquals(amt0, amt1);
    }

    @Test
    public void registerTestFail() {
        API api = new API();

        api.register("a", "a");
        Assertions.assertEquals("""
             Username must include 1 Uppercase, 1 Lowercase, and must be between 8 and 16 characters.
             Password must include 1 Uppercase, 1 Lowercase, 1 number, 1 special character, and be 16-24 characters.
             """, api.getResult());
    }

    @Test
    public void registerTestPass() {
        API api = new API();
        String uname = randomUname();
        String pass = randomPass();
        Assertions.assertTrue(api.register(uname, pass));
        Assertions.assertEquals("User " + uname + " successfully registered.",  api.getResult());
    }

    @Test
    public void usernameRepeat() {
        API api = new API();
        String username = randomUname();

        api.register(username, randomPass());
        Assertions.assertEquals("User " + username + " successfully registered.", api.getResult());

        api.register(username, randomPass());
        Assertions.assertEquals("Username taken. Choose a different username.", api.getResult());
    }

    @Test
    public void transferNonUUID() {
        API api = new API();
        String uname = randomUname();
        String pw = randomPass();

        Assertions.assertTrue(api.register(uname, pw));
        Assertions.assertTrue(api.login(uname, pw));
        api.transfer("foo", "bar", "100.00");
        Assertions.assertEquals("One or both accounts are invalid bank account numbers.", api.getResult());
    }

    @Test
    public void randomUUIDTransfer() {
        API api = new API();
        String uname = randomUname();
        String pw = randomPass();

        Assertions.assertTrue(api.register(uname, pw));
        Assertions.assertTrue(api.login(uname, pw));

        String src = UUID.randomUUID().toString();
        String dest = UUID.randomUUID().toString();
        api.transfer(src, dest, "100.00");
        Assertions.assertEquals("Source account does not exist.", api.getResult());
    }
}
