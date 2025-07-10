import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/AgentDashboard.css';

const AgentDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({});
  const [bookings, setBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [bookingPanelOpen, setBookingPanelOpen] = useState(false);

  const navigate = useNavigate();
  const agent = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get('/properties/my');
        setProperties(res.data);

        const initialIndexes = {};
        res.data.forEach((prop) => {
          initialIndexes[prop._id] = 0;
        });
        setImageIndexes(initialIndexes);
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await API.get('/bookings/agent');

        const pending = res.data.filter(b => b.status === 'Pending');
        const accepted = res.data.filter(b => b.status === 'Accepted');

        setBookings(pending);
        setAcceptedBookings(accepted);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };

    fetchProperties();
    fetchBookings();
  }, []);

  const refreshBookings = async () => {
    try {
      const res = await API.get('/bookings/agent');
      setBookings(res.data.filter(b => b.status === 'Pending'));
      setAcceptedBookings(res.data.filter(b => b.status === 'Accepted'));
    } catch (err) {
      console.error('Failed to refresh bookings:', err);
    }
  };

  const handleNextImage = (id, total) => {
    setImageIndexes((prev) => ({ ...prev, [id]: (prev[id] + 1) % total }));
  };

  const handlePrevImage = (id, total) => {
    setImageIndexes((prev) => ({ ...prev, [id]: (prev[id] - 1 + total) % total }));
  };

  const handleEdit = (id) => navigate(`/agent/edit-property/${id}`);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this property?');
    if (!confirm) return;

    try {
      await API.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status });
      alert(`Booking ${status.toLowerCase()} successfully.`);
      await refreshBookings(); // Ensure latest state is fetched from backend
    } catch (err) {
      console.error(`Error updating status:`, err);
    }
  };

  return (
    <div className="agent-dashboard">
      <h2 className="agent-heading">Welcome, {agent?.name || 'Agent'}</h2>

      <div className="dashboard-controls">
        <button onClick={() => navigate('/agent/add-property')} className="add-property-btn">
          + Add New Property
        </button>

        <div className="booking-notification">
          <button className="notif-btn" onClick={() => setBookingPanelOpen(!bookingPanelOpen)}>
            📩 Booking Requests ({bookings.length}) ▼
          </button>
          {bookingPanelOpen && (
            <div className="notif-dropdown">
              {bookings.length === 0 ? (
                <p>No new booking requests.</p>
              ) : (
                bookings.map((b) => (
                  <div key={b._id} className="notif-item box">
                    <p><strong>Customer:</strong> {b.customer.name} ({b.customer.email})</p>
                    <p><strong>Property:</strong> {b.property.title}</p>
                    <p><strong>Date:</strong> {new Date(b.visitDate).toLocaleDateString()}</p>
                    <div className="notif-actions">
                      <button onClick={() => handleStatusChange(b._id, 'Accepted')} className="accept-btn">Accept</button>
                      <button onClick={() => handleStatusChange(b._id, 'Rejected')} className="reject-btn">Reject</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="section-heading">Accepted Visits:</h3>
      {acceptedBookings.length === 0 ? (
        <p className="status-text">No accepted bookings.</p>
      ) : (
        <ul className="accepted-list">
          {acceptedBookings.map((b) => (
            <li key={b._id} className="accepted-item">
              <strong>{b.customer.name}</strong> will visit <strong>{b.property.title}</strong> on <strong>{new Date(b.visitDate).toLocaleDateString()}</strong>
            </li>
          ))}
        </ul>
      )}

      <h3 className="section-heading">Your Listed Properties:</h3>

      {loading ? (
        <p className="status-text">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="status-text">No properties listed yet.</p>
      ) : (
        <div className="property-grid">
          {properties.map((prop, index) => (
            <div key={prop._id} className={`property-card ${index % 2 === 0 ? 'left-card' : 'right-card'}`}>
              <div className="property-content">
                <div className="property-details">
                  <h4>{prop.title}</h4>
                  <p><strong>Price:</strong> ₹{prop.price}</p>
                  <p><strong>Location:</strong> {prop.location}</p>
                  <p>{prop.description}</p>
                  <div className="property-actions">
                    <button className="delete-btn" onClick={() => handleDelete(prop._id)}>Delete</button>
                  </div>
                </div>

                {prop.images?.length > 0 && (
                  <div className="carousel-container">
                    <button onClick={() => handlePrevImage(prop._id, prop.images.length)} className="carousel-btn left">◀</button>
                    <img
                      src={`http://localhost:8000/uploads/${prop.images[imageIndexes[prop._id]]}`}
                      alt="property"
                      className="carousel-image"
                    />
                    <button onClick={() => handleNextImage(prop._id, prop.images.length)} className="carousel-btn right">▶</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
