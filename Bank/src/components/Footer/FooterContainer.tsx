import React from "react";
import "./FooterContainer.css";
import { Link } from 'react-router-dom';


export default class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                <div className="logo">&gt;_ Bank of <b>CLI</b></div>
                <div className="copyright">Copyright &copy; {new Date().getFullYear()} Bank of CLI</div>
                <div className="Connect">
                    <Link to="/Connect">Connect</Link>
                </div>
            </footer>
        )
        
    }
}
