import { useState, type Dispatch, type SetStateAction } from "react";
import { AuthService } from "../service/AuthService";
import { toast, Button } from "../utils/Database";
import "../index.css";
import { Link } from "react-router-dom";




type User = {
  id: string;
  name: string;
  email: string;
};

type LoginProps = {
  setUser: (user: User) => void;
  setToasts: Dispatch<SetStateAction<{ id: number; msg: string; bad: boolean }[]>>;
};

export default function Auth({ setUser, setToasts }: LoginProps) {
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", pw: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const reg = authMode === "register";

  const setErr = (field: string, msg: string) => {
    setErrors(prev => ({ ...prev, [field]: msg }));
    return msg === "";
  };

  const handleSubmit = async () => {
    const { name, email, pw } = form;

    let ok = setErr("email", /^\S+@\S+\.\S+$/.test(email) ? "" : "Enter a valid email.");
    ok = setErr("pw", pw.length >= 8 ? "" : "Minimum 8 characters.") && ok;
    if (reg) ok = setErr("name", name.trim() ? "" : "Name is required.") && ok;
    if (!ok) return;

    setLoading(true);
    try {
      const res = reg
        ? await AuthService.register(name.trim(), email.trim(), pw)
        : await AuthService.login(email.trim(), pw);

      if ("error" in res) {
        toast(setToasts, res.error.message, true);
        return;
      }

      toast(setToasts, `Welcome, ${res.data.name.split(" ")[0]}!`);
      setUser(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="card" onSubmit = {handleSubmit}>
        <div className="logo">&gt;_ Bank of <b>CLI</b></div>

        <div className="tabs">
          <button className={authMode === "login" ? "on" : ""} onClick={() => setAuthMode("login")}>
            Sign in
          </button>
          <button className={authMode === "register" ? "on" : ""} onClick={() => setAuthMode("register")}>
            Register
          </button>
        </div>

        {reg && (
          <div>
            <label>Full name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>
        )}

        <div>
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <div className="err">{errors.email}</div>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={form.pw}
            onChange={e => setForm({ ...form, pw: e.target.value })}
          />
          {errors.pw && <div className="err">{errors.pw}</div>}
        </div>

        <Button
          id="go"
          label={loading ? "Please wait..." : reg ? "Create account" : "Sign in"}
          onClick={handleSubmit}
          loading={loading}
        />

        <div className="hint mono">demo: ada@bankofcli.dev / password123</div>
      </div>
      
      <footer className="footer">
        <div className="logo">&gt;_ Bank of <b>CLI</b></div>
        <div className="copyright">Copyright &copy; {new Date().getFullYear()} Bank of CLI</div>
        <div className="Connect">
          <Link to="/connect">Connect</Link>
        </div>
      </footer>
    </div>
  );
}