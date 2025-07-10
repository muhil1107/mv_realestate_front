import axios from 'axios';

const BASE_URL = "https://mv-realestate.onrender.com";

export const API = axios.create({
  baseURL: BASE_URL,
});
// Add token to headers automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
