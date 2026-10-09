import React from "react";
import { Link } from "react-router-dom";
import "./Connect.css";

type Member = {
  name: string;
  role: string;
  img: string;
}

const team: Member[] = [
  { name: "David Villareal", role: "Contract & Types", img: "/"},
  { name: "William Sancho", role: "Role Here", img: "/"},
  { name: "Yousef Abuadas", role: "Role Here", img: "/"},
  { name: "Tuan Dinh", role: "Role Here", img: "/"},
  { name: "Eric Meitz", role: "Role Here", img: "/"},
  { name: "Amen Akploh", role: "Role Here", img: "/"},
  { name: "Nathen Calderon", role: "Authentication Screens", img: "/"},
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
                    <img src={m.img} alt={m.name} />
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
            
         
