import { useState } from "react";
import Login from "./components/Login";
import { Dashboard } from "./components/Dashboard";

type Toast = { id: number; msg: string; bad: boolean };
type User = { id: string; name: string; email: string };

export default function AppRoot() {
  const [user, setUser] = useState<User | null>(null);
  const [, setToasts] = useState<Toast[]>([]);

  return (
    <>
      {user ? (
        <Dashboard
          user={user}
          onLogout={() => setUser(null)}
          setToasts={setToasts}
        />
      ) : (
        <Login
          setUser={setUser}
          setToasts={setToasts}
        />
      )}
    </>
  );
}
