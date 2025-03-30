import React from 'react';
import { FaTwitter, FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p1>India Meteorological Department,</p1><br></br>
          <p1>Shivajinagar, Pune-411005</p1><br></br>
          <p1>TELEPHONE : 020-25535877</p1><br></br>
          <p1>FAX : 091-020-25535435</p1>
        </div>

        <div className="footer-section">
          <h3>Important Links</h3>
          <ul>
            <li><a href="https://www.imdpune.gov.in/">IMD PUNE OFFICIAL WEBSITE</a></li>
            <li><a href="http://aws.imd.gov.in:8091/">AWS ARG NETWORKS</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <ul>
            <li>
              <a href="https://twitter.com/imd_pune">
                <FaTwitter /> Twitter
              </a>
            </li>
            <li>
              <a href="https://facebook.com/imd_pune">
                <FaFacebook /> Facebook
              </a>
            </li>
            <li>
              <a href="https://youtube.com/imd_pune">
                <FaYoutube /> YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
