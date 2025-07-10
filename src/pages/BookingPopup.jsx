import React, { useState } from 'react';
import API from '../services/api';
import '../styles/BookingPopup.css'; // Optional for styling

const BookingPopup = ({ show, onClose, propertyId, agentId }) => {
  const [visitDate, setVisitDate] = useState('');
  const customer = JSON.parse(localStorage.getItem('user'));
  const [message, setMessage] = useState('');

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        customer: customer.id,
        agent: agentId,
        property: propertyId,
        visitDate,
      });
      setMessage('Booking successful!');
      alert("Booking is Done Sucessfully");
      onClose();
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      setMessage('Booking failed.');
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-container">
        <h3>Book Property Visit</h3>
        <form onSubmit={handleSubmit}>
          <label>Customer ID:</label>
          <input type="text" value={customer?.id || 'Not found'} readOnly />

          <label>Agent ID:</label>
          <input type="text" value={agentId} readOnly />

          <label>Property ID:</label>
          <input type="text" value={propertyId} readOnly />

          <label>Visit Date:</label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            required
          />

          <button type="submit">Book</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default BookingPopup;
