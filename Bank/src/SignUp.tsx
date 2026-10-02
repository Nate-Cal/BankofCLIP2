import './SignUp.css'
import { useNavigate } from 'react-router-dom'

function SignUp() {

    const navigate = useNavigate();

    function handleSignUpSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Handle the sign-up logic here
        console.log('Sign-up form submitted');
        navigate('/login');
    }   

  return (
    <div className="flex-col">
        <div className="itemHeader">
            <h1>Sign Up for a New Account</h1>

            
            {/* Top-Left Home Button */}
            {/* Home Icon */}
            <div className="home-button">
                <button type="button" onClick={() => window.location.href = '/'}>
                    Home
                </button>
            </div>
        </div>

        <div className="item grow-main">
            <p>
                Please fill out the form below to create a new account.
            </p>

            <form>
                <label htmlFor="firstName">First Name:</label>
                <input type="text" id="firstName" name="firstName" required />

                <label htmlFor="lastName">Last Name:</label>
                <input type="text" id="lastName" name="lastName" required />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="phone">Phone Number:</label>
                <input type="tel" id="phone" name="phone" required />
                
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <button type="submit" onClick={handleSignUpSubmit}>Sign Up</button>
            </form>

            <p>Already have an account? <a href="/login">Login</a></p>
        </div>

        <div className="itemFooter">
            <p>&copy; 2026 Bank of CLI. All rights reserved.</p>
            <p><a href="/meettheteam">Connect With Us</a></p>
        </div>



    </div>
  )
}

export default SignUp;

