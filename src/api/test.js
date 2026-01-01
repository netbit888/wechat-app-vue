import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};

export const fetchTestData = async () => {
  const response = await axios.get(`${API_BASE_URL}/test`);
  return response.data;
};

export const createTestData = async (message) => {
  const response = await axios.post(`${API_BASE_URL}/test`, { message });
  return response.data;
};