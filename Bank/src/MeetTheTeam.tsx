import './MeetTheTeam.css'

function MeetTheTeam() {
  return (
    <div className="flex-col">
      <div className="itemHeader">
        <h1>Meet the Team</h1>

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
          Welcome to our team page! We are a group of dedicated professionals committed to providing the best banking experience for our customers. Our team consists of experts in finance, technology, and customer service, all working together to ensure your banking needs are met with excellence.
        </p>

        <p>
          Get to know us better and learn about our mission, values, and the people behind the scenes who make it all happen.
        </p>
      </div>

      <div className="itemFooter">
        <p>&copy; 2026 Bank of CLI. All rights reserved.</p>
      </div>
    </div>
  )
}

export default MeetTheTeam