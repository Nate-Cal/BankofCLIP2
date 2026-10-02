import './Login.css'

import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Handle the login logic here
        console.log('Login form submitted');
        navigate('/account');

    }

  return (
    <div className="flex-col">
      <div className="itemHeader">
        <h1>Login to Your Account</h1>

        <button type="button" onClick={() => window.location.href = '/'}>
                Home
        </button>

      </div>

        <div className="item grow-main">
            <p>
                Please enter your login credentials to access your account.
            </p>

            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <button type="submit" onClick={handleLoginSubmit}>Login</button>
            </form>

            <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>

        <div className="itemFooter">
            <p>&copy; 2026 Bank of CLI. All rights reserved.</p>
            <p><a href="/meettheteam">Connect With Us</a></p>
        </div>

        

    </div>
  )
}

export default Login;