import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="top-header">
        <img src="/IMD.png" alt="Left Logo" className="logo-image" />
        <div className="logo-text">
          <h1>India Meteorological Department</h1>
          <p>Ministry of Earth Sciences, Government of India</p>
        </div>
        <img src="/BharatS.png" alt="Right Logo" className="logo-img" />
      </div>

      <nav className="nav-menu">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/AWS_Network">AWS Network</Link></li>
          <li><Link to="/realtimedata">Real-Time Data</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
