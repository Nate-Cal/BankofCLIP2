import './Home.css'
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();
  
  function handleReturningUserClick() {
    // Handle the logic for returning user click
    console.log('Returning User button clicked');
    // Redirect to the Login Page
    navigate('/login');
  }

  function handleNewUserClick() {
    // Handle the logic for new user click
    console.log('New User button clicked');
    // Redirect to the SignUp Page
    navigate('/signup');
  }
    
  return (
    <div className="flex-col"> 
      <div className="itemHeader">
        <h1>Welcome to the Bank of CLI!</h1>
      </div>

      <div className="item grow-main">
        <p> 
          Bank of CLI is a simple banking application that allows user to manage
          their bank accounts, make transactions, and view their account balances.
        </p>

        <p>
          This application is built using React, Vite, TypeScript, HTML, and CSS. 
        </p>

        <h2>Do You Have An Existing Account?</h2>

        <div className="flex-row">
          <button onClick={handleReturningUserClick}>
            Returning User
            </button>
          <button onClick={handleNewUserClick}>
            New User
          </button>
        </div>
      </div>
        <div className="itemFooter">
          <p>&copy; 2026 Bank of CLI. All rights reserved.</p>
          <p><a href="/meettheteam">Connect With Us</a></p>
        </div>
        
    </div>
    
  )
}

export default Home;
