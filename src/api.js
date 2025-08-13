import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Credit evaluation
export const submitCreditData = async (data) => {
  const response = await axios.post(`${API_URL}/credit-inputs`, data);
  return response.data;
};

export const getCreditHistory = async () => {
  const response = await axios.get(`${API_URL}/credit-inputs`);
  return response.data;
};

export const getCreditResult = async (inputId) => {
  const response = await axios.get(`${API_URL}/credit-results/${inputId}`);
  return response.data;
};

// Admin functions
export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`);
  return response.data;
};

export const getUserStats = async () => {
  const response = await axios.get(`${API_URL}/admin/stats`);
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await axios.patch(`${API_URL}/admin/users/${userId}`, { role });
  return response.data;
};