import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Connect from "./pages/Connect";
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ToastContainer } from "./components/Toast/ToastContainer";

// Type definition for the user state
type User = { id: string; name: string; email: string };

export default function AppRoot() {
  const [user, setUser] = useState<User | null>(null);

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
              <Dashboard user={user} onLogout={() => setUser(null)} />
            ) : (
              <Login setUser={setUser} />
            )
          } 
        />
      </Routes>
    </ToastContainer>
  );
}
