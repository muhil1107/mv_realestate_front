import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mv-realestate.onrender.com/api',
});

// Add token to headers automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
