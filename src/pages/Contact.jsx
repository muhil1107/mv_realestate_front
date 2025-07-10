import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Real Estate Management Software</h1>
        <p>Beyond Brick Walls</p>
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <ul>
          <li>Sales</li>
          <li>Payments</li>
          <li>Agents</li>
          <li>Agent Commissions</li>
          <li>Customers</li>
          <li>Pending Payments</li>
          <li>Plot Allotments</li>
          <li>Ventures etc.</li>
        </ul>
      </div>

      <div className="info-row">
        <div className="about-section">
          <h2>About Us</h2>
          <p>
            We provide real estate management solutions for everything from property listings to agent booking and booking tracking. Our platform helps streamline the sales process and enhances customer engagement.
          </p>
        </div>

        <div className="contact-section">
          <h2>Contact Us</h2>
          <p><strong>Phone:</strong> 6381910757</p>
          <p><strong>Email:</strong> muhil1107@gmail.com</p>
          <p><strong>Address:</strong> Coimbatore, Tamil Nadu, India</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
