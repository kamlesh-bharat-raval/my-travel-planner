import React from 'react';
import './Footer.css';
import { Plane, Github, Linkedin, Mail, Globe, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer no-print">
      <div className="footer-container">
        
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <Plane size={28} className="logo-icon-svg" /> 
              <h3>Travel Planner</h3>
            </div>
            <p className="brand-description">
              Explore the world with ease. Plan your perfect journey with our premium itinerary builder.
            </p>
          </div>

          {/* Column 2: Discover */}
          <div className="footer-col">
            <h4>Discover</h4>
            <ul className="footer-links">
              <li><a href="/">Destinations</a></li>
              <li><a href="/planner">Trip Planner</a></li>
              <li><a href="/saved">My Tickets</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="footer-col">
            <h4>Get in Touch</h4>
            <div className="contact-info">
              <a href="mailto:support@travel.com" className="contact-item">
                <Mail size={16} /> <span>support@travel.com</span>
              </a>
              <div className="contact-item">
                <Globe size={16} /> <span>English (US)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright-text">
            <p>&copy; {currentYear} Travel Planner. Developed by <strong>Kamlesh Raval</strong></p>
          </div>
          
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
              <Github size={18} />
              <span>GitHub</span>
              <ExternalLink size={12} className="external-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link-item">
              <Linkedin size={18} />
              <span>LinkedIn</span>
              <ExternalLink size={12} className="external-icon" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}