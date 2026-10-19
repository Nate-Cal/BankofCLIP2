import { useState } from 'react';
import { wait } from '../util/Utilities'; 
import { useToast } from '../components/Toast/ToastContainer';

interface LoginProps {
  setUser: (user: any) => void;
}

export default function Login({ setUser }: LoginProps) {
  const { showToastMessage } = useToast();
  
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Real-time password validation logic
  const reqLength = password.length >= 8;
  const reqNum = /\d/.test(password);
  const reqSpec = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = reqLength && reqNum && reqSpec;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Check if all required fields are filled
    if (!email || !password || (isRegister && !name)) {
      setError('Please fill out all fields.');
      return;
    }

    // 2. If registering, strictly enforce password rules
    if (isRegister && !isPasswordValid) {
      setError('Please meet all password requirements.');
      return;
    }

    // 3. NEW: If signing in, strictly check against demo credentials
    if (!isRegister) {
      if (email !== 'ada@bankofcli.dev' || password !== 'password123') {
        setError('Invalid email or password. Please try again.');
        return;
      }
    }

    setLoading(true);

    try {
      // Simulate network request
      await wait(1200);
      
      const mockUser = {
        id: `u_${Date.now()}`,
        name: isRegister ? name : 'Ada Lovelace',
        email: email
      };
      
      showToastMessage(isRegister ? "Account created successfully!" : "Welcome back!", false);
      setUser(mockUser);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleTabSwitch = (toRegister: boolean) => {
    setIsRegister(toRegister);
    setError('');
    setPassword(''); // Reset password to clear checklist
  };

  return (
    <div className="auth">
      <div className="card card-animate">
        
        <div className="logo">
          &gt;_ Bank of <b>CLI</b>
        </div>

        <div className="tabs">
          <button 
            type="button" 
            className={!isRegister ? 'on' : ''} 
            onClick={() => handleTabSwitch(false)}
          >
            Sign in
          </button>
          <button 
            type="button" 
            className={isRegister ? 'on' : ''} 
            onClick={() => handleTabSwitch(true)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-animate">
          {isRegister && (
            <div className="input-group fade-in-down">
              <label>Full name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                disabled={loading}
              />
            </div>
          )}

          <div className="input-group fade-in-down" style={{ animationDelay: '0.1s' }}>
            <label>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ada@bankofcli.dev"
              disabled={loading}
            />
          </div>

          <div className="input-group fade-in-down" style={{ animationDelay: '0.2s' }}>
            <label>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* REAL-TIME CHECKLIST ANIMATION */}
          {isRegister && (
            <div className="password-checklist fade-in-down" style={{ animationDelay: '0.3s' }}>
              <div className={`check-item ${reqLength ? 'valid' : ''}`}>
                <CheckIcon isValid={reqLength} />
                <span>8+ characters</span>
              </div>
              <div className={`check-item ${reqNum ? 'valid' : ''}`}>
                <CheckIcon isValid={reqNum} />
                <span>At least 1 number</span>
              </div>
              <div className={`check-item ${reqSpec ? 'valid' : ''}`}>
                <CheckIcon isValid={reqSpec} />
                <span>At least 1 special character</span>
              </div>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {error && <div className="err fade-in-down">{error}</div>}

          <button 
            type="submit" 
            className="btn fade-in-down" 
            disabled={loading || (isRegister && !isPasswordValid)}
            style={{ animationDelay: '0.4s' }}
          >
            {loading ? <span className="spin" /> : (isRegister ? 'Create account' : 'Sign in')}
          </button>
        </form>

        <div className="hint fade-in-down" style={{ animationDelay: '0.5s' }}>
          demo: ada@bankofcli.dev / password123
        </div>

      </div>
    </div>
  );
}

// Helper SVG Icon Component for the Checklist
function CheckIcon({ isValid }: { isValid: boolean }) {
  return (
    <div className={`check-circle ${isValid ? 'filled' : ''}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
}