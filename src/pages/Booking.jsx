import React, { useState } from 'react';
import API from '../services/api';

const Booking = ({ propertyId, agentId }) => {
  const [visitDate, setVisitDate] = useState('');
  const [message, setMessage] = useState('');

  const customer = JSON.parse(localStorage.getItem('user'));

  const handleBooking = async () => {
    if (!visitDate) {
      setMessage('Please select a visit date.');
      return;
    }

    try {
      const response = await API.post('/bookings', {
        property: propertyId,
        agent: agentId,
        customer: customer?._id,
        visitDate,
      });

      setMessage('Booking request sent successfully!');
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to send booking request.');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <label htmlFor="visit-date">Choose a Visit Date:</label>
      <input
        type="date"
        id="visit-date"
        value={visitDate}
        onChange={(e) => setVisitDate(e.target.value)}
        style={{ margin: '0 10px' }}
      />
      <button onClick={handleBooking} className="book-btn">Book Visit</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Booking;
