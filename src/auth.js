import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const setAuthToken = (token, role) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    if (role) localStorage.setItem('role', role);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
};

export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  if (response.data.token) {
    setAuthToken(response.data.token, response.data.user?.role);
  }
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    setAuthToken(response.data.token, response.data.user?.role);
  }
  return response.data;
};

export const logout = () => {
  setAuthToken(null);
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await axios.get(`${API_URL}/me`);
    const userData = response.data;
    
    // Ensure role exists (fallback to localStorage or default)
    if (!userData.role) {
      userData.role = localStorage.getItem('role') || 'user';
    }
    
    return userData;
  } catch (err) {
    logout();
    return null;
  }
};

export const isAdmin = () => {
  return localStorage.getItem('role') === 'admin';
};