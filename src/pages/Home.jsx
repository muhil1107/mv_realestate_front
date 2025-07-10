import React, { useEffect, useState } from 'react';
import '../styles/Home.css';
import { motion } from 'framer-motion';

const Home = () => {
  const [displayStats, setDisplayStats] = useState({
    products: 0,
    customers: 0,
    awards: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchMessage, setSearchMessage] = useState('');

  const finalStats = {
    products: 9000,
    customers: 2000,
    awards: 28,
  };

  useEffect(() => {
    const duration = 5000;
    const steps = 150;
    const intervalTime = duration / steps;

    let currentStep = 0;

    const incrementStats = () => {
      currentStep++;
      setDisplayStats({
        products: Math.floor((finalStats.products / steps) * currentStep),
        customers: Math.floor((finalStats.customers / steps) * currentStep),
        awards: Math.floor((finalStats.awards / steps) * currentStep),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setDisplayStats(finalStats);
      }
    };

    const timer = setInterval(incrementStats, intervalTime);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setSearchMessage('⚠️ Please login or signup to discover properties.');
      return;
    }

    setSearchMessage(`🔍 Searching properties for "${searchTerm}"...`);
    // Call actual search logic here if user is logged in
  };

  return (
    <div className="home-container">
      <div className="left-section overlay-container">
        <div className="image-overlay" />

        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className='header'
        >
          Discover Most <br />Suitable Property
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Find a variety of properties that suit you very easily
          <br /> Forget all difficulties in finding a residence for you
        </motion.p>

        <motion.div
          className="search-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <input
            type="text"
            placeholder="Enter location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </motion.div>

        {searchMessage && (
          <motion.p
            style={{ color: '#ff9800', marginTop: '1rem', fontWeight: 'bold' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {searchMessage}
          </motion.p>
        )}

        <motion.div
          className="stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div>
            <h2>{displayStats.products.toLocaleString()}+</h2>
            <p>Premium Product</p>
          </div>
          <div>
            <h2>{displayStats.customers.toLocaleString()}+</h2>
            <p>Happy Customer</p>
          </div>
          <div>
            <h2>{displayStats.awards}+</h2>
            <p>Awards Winning</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="right-section"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="image-arch">
          <img src="../assets/Property.png" alt="property" />
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
