import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import "../styles/AddProperty.css";

const AddProperty = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 4);
    setImages(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      images.forEach((img) => data.append('images', img));

      await API.post('/properties/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Property added successfully!');
      setForm({ title: '', description: '', price: '', location: '' });
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to add property');
    }
  };

  const handleBack = () => {
    navigate('/agent/dashboard');
  };

  return (
    <>
      {/* Fixed back button on top-left of page */}
      <button className="back-button-fixed" onClick={handleBack}>
        ⬅ Back to Dashboard
      </button>

      <div className="add-property-container">
        <h2>Add New Property</h2>

        <form className="add-property-form" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            className="input-title"
            placeholder="Property Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-input"
            placeholder="Property Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="price">Price (₹)</label>
          <input
            id="price"
            name="price"
            type="number"
            className="form-input"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            className="input-location"
            placeholder="Enter location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <label htmlFor="images">Upload Property Images</label>
          <input
            id="images"
            type="file"
            className="input-file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Max 4 images allowed</small>

          {images.length > 0 && (
            <div className="image-preview-container">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index + 1}`}
                />
              ))}
            </div>
          )}

          <button type="submit">Add Property</button>
        </form>

        {message && (
          <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default AddProperty;
