import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Connect from "./pages/Connect";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ToastContainer } from "./components/Toast/ToastContainer";

// Type definition for the user state
type User = { id: string; name: string; email: string };

export default function AppRoot() {
  // 1. Initialize state by checking if a user is already saved in localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("bank_user_session");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // 2. Custom function to update both React State AND localStorage at the same time
  const handleSetUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem("bank_user_session", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("bank_user_session"); // Clear it on logout
    }
    setUser(newUser);
  };

  return (
    <ToastContainer>
      <Routes>
        {/* Route for the Connect page */}
        <Route path="/connect" element={<Connect />} />
        
        {/* Catch-all route that handles Authentication */}
        <Route 
          path="*" 
          element={
            user ? (
              // Use handleSetUser(null) to log out
              <Dashboard user={user} onLogout={() => handleSetUser(null)} />
            ) : (
              // Pass handleSetUser so the Login component can save the session
              <Login setUser={handleSetUser} />
            )
          } 
        />
      </Routes>
    </ToastContainer>
  );
}
