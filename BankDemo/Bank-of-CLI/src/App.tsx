import { useState } from "react";
import Connect from "./components/Connect";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { ToastContainer } from "./components/ToastContainer";
import {Routes, Route} from "react-router-dom";

type Toast = { id: number; msg: string; bad: boolean };
type User = { id: string; name: string; email: string };

export default function AppRoot() {
  const [user, setUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  return (
    <>
      <Routes>
        <Route path="/connect" element={<Connect />} />
        <Route path="*" element={
          user ? (
          <Dashboard
            user={user}
            onLogout={() => setUser(null)}
            setToasts={setToasts}
        />
      ) : (
        <Login setUser={setUser} setToasts={setToasts}/>
      )
    } 
  />
  </Routes>
      

   <ToastContainer toasts={toasts} />
  </>
  );
}
