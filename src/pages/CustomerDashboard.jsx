import React, { useEffect, useState } from 'react';
import API from '../services/api';
import '../styles/CustomerDashboard.css';
import BookingPopup from './BookingPopup';

const CustomerDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [searchTitle, setSearchTitle] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const customer = JSON.parse(localStorage.getItem('user'));
  const today = new Date();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await API.get('/properties');
        setProperties(res.data);
        setFilteredProperties(res.data);

        const initialIndexes = {};
        res.data.forEach((p) => {
          initialIndexes[p._id] = 0;
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
        const res = await API.get('/bookings/customer');
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch customer bookings:', err);
      }
    };

    fetchProperties();
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...properties];

    if (searchTitle.trim()) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    if (locationFilter !== 'all') {
      result = result.filter(p => p.location === locationFilter);
    }

    if (minPrice !== '') {
      result = result.filter(p => p.price >= parseInt(minPrice));
    }

    if (maxPrice !== '') {
      result = result.filter(p => p.price <= parseInt(maxPrice));
    }

    if (sortOrder === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(result);
  }, [searchTitle, sortOrder, locationFilter, minPrice, maxPrice, properties]);

  const handleNext = (id, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % total,
    }));
  };

  const handlePrev = (id, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + total) % total,
    }));
  };

  const handleBookClick = (property) => {
    setSelectedProperty(property);
    setShowPopup(true);
  };

  const uniqueLocations = [...new Set(properties.map((p) => p.location))];

  const acceptedBookings = bookings.filter(b => b.status === 'Accepted');
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const rejectedBookings = bookings.filter(b => b.status === 'Rejected');

  return (
    <div className="customer-dashboard">
      <h2 className="welcome-text">Welcome, {customer?.name || 'Customer'}</h2>
      <p className="sub-text">Browse available properties below:</p>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="filter-input"
        />

        <select onChange={(e) => setLocationFilter(e.target.value)} value={locationFilter}>
          <option value="all">All Locations</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="filter-input"
        />

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="">Sort by Price</option>
          <option value="lowToHigh">Low → High</option>
          <option value="highToLow">High → Low</option>
        </select>
      </div>

      <h3 className="section-heading">Your Bookings:</h3>
      {bookings.length === 0 ? (
        <p className="status-text">No bookings yet.</p>
      ) : (
        <div className="booking-columns">
          {/* Accepted */}
          <div className="booking-column left-column">
            <h4 data-count={`(${acceptedBookings.length})`}>✅ Accepted</h4>
            {acceptedBookings.map(b => {
              const visitDate = new Date(b.visitDate);
              return (
                <div key={b._id} className="booking-item accepted">
                  <strong>{b.property?.title || 'Unknown'}</strong><br />
                  Visit on: {visitDate.toLocaleDateString()}
                </div>
              );
            })}
          </div>

          {/* Pending & Rejected */}
          <div className="booking-column right-column">
            <h4 data-count={`(${pendingBookings.length})`}>⏳ Pending</h4>
            {pendingBookings.map(b => {
              const visitDate = new Date(b.visitDate);
              return (
                <div key={b._id} className="booking-item pending">
                  <strong>{b.property?.title || 'Unknown'}</strong><br />
                  Visit on: {visitDate.toLocaleDateString()}
                </div>
              );
            })}

            <h4 data-count={`(${rejectedBookings.length})`}>❌ Rejected</h4>
            {rejectedBookings.map(b => {
              const visitDate = new Date(b.visitDate);
              return (
                <div key={b._id} className="booking-item rejected">
                  <strong>{b.property?.title || 'Unknown'}</strong><br />
                  Visit on: {visitDate.toLocaleDateString()}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <p className="status-text">Loading properties...</p>
      ) : filteredProperties.length === 0 ? (
        <p className="status-text">No properties match your criteria.</p>
      ) : (
        <div className="customer-grid">
          {filteredProperties.map((prop) => (
            <div key={prop._id} className="customer-card">
              <div className="customer-carousel">
                {prop.images?.length > 0 && (
                  <>
                    <button className="carousel-btn left" onClick={() => handlePrev(prop._id, prop.images.length)}>◀</button>
                    <img
                      src={`http://localhost:8000/uploads/${prop.images[imageIndexes[prop._id]]}`}
                      alt="property"
                      className="carousel-image"
                    />
                    <button className="carousel-btn right" onClick={() => handleNext(prop._id, prop.images.length)}>▶</button>
                  </>
                )}
              </div>

              <div className="customer-info">
                <h3>{prop.title}</h3>
                <p><strong>Price:</strong> ₹{prop.price}</p>
                <p><strong>Location:</strong> {prop.location}</p>
                <p><strong>Description:</strong> {prop.description}</p>
                <p><strong>Agent:</strong> {prop.agent?.name} ({prop.agent?.email})</p>
                <button onClick={() => handleBookClick(prop)}>Book Visit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        propertyId={selectedProperty?._id}
        agentId={selectedProperty?.agent?._id}
      />
    </div>
  );
};

export default CustomerDashboard;
