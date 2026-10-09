import React from "react";
import { Link } from "react-router-dom";
import "./Connect.css";

type Member = {
  name: string;
  role: string;
}

const team: Member[] = [
  { name: "David Villareal", role: "Contract & Types"},
  { name: "William Sancho", role: "Transaction Center"},
  { name: "Yousef Abuadas", role: "Feedback System"},
  { name: "Tuan Dinh", role: "Design System"},
  { name: "Eric Meitz", role: "Dashboard"},
  { name: "Amen Akploh", role: "Services & Mocks"},
  { name: "Nathen Calderon", role: "Authentication Screens"},
];

type State = {openName : string | null};

export default class Connect extends React.Component<{}, State> {
  
  state: State = {openName: null};

  toggle = (name: string) => {
    this.setState(s => ({ openName: s.openName === name ? null : name}));
  }


  render() {
    return (
      <div className="meet-the-team">
        <header className="team-header">       
            <Link to="/" className="backButton" aria-label="Back to Previous Page">
              &larr;
            </Link>
          <h1>Meet the Team</h1>
        </header>
        <ul className="team-grid">
          {team.map(m => {
            const open = this.state.openName === m.name;
            return (
              <li key={m.name} className={`team-card${open ? " open" : ""}`}>
                <button 
                  className="team-card-button"
                  onClick={() => this.toggle(m.name)}
                  aria-expanded={open}
                >
                  <strong>{m.name}</strong>
                </button>

                {open && (
                  <div className="team-details">
                    <p className="role">{m.role}</p>
                  </div>
                )}
              </li>
            );
          })}
          </ul>
          </div>
    );
  }
}
            
         
