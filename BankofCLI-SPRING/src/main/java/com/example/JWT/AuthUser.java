package com.example.JWT;

// The logged-in user, built from a valid JWT by JwtFilter
// Controllers can get it with:  @AuthenticationPrincipal AuthUser me
// Always use me.userId() to decide whose data to return - never an id from the URL/body
public record AuthUser(int userId, String email, String role) {
}
