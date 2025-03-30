import React, { useState } from "react";
import { Link } from "react-router-dom";


const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="header">
      <div className="top-header">
        <div className="logo-container">
          <div className="logo-text">
            <h1>India Meteorological Department</h1>
            <p>Ministry of Earth Sciences, Government of India</p>
          </div>
        </div>
      </div>

      <nav className="nav-menu">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/AWS_Network">AWS Network</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><a href="http://aws.imd.gov.in:8091/state/MAHARASHTRA/" target="_blank" rel="noopener noreferrer"> Live Updates</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
