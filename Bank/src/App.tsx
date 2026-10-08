import { useState } from "react";
import Connect from "./pages/Connect"
import Login from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ToastContainer } from "./components/Toast/ToastContainer";
import {Routes, Route} from "react-router-dom";

type User = { id: string; name: string; email: string };

export default function AppRoot() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <ToastContainer>
      <Routes>
        <Route path="/connect" element={<Connect />} />
        <Route path="*" element={user ? (
          <Dashboard user={user} onLogout={() => setUser(null)} />) : 
          ( <Login setUser={setUser} /> ) 
        } 
      />
      </Routes>
    </ToastContainer>
          
  );
}
