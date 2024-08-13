import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin'; // Update this with your actual API URL

const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

const toggleBlockUser = async (userId) => {
  const response = await axios.patch(`${API_URL}/users/${userId}/block`);
  return response.data;
};

export { fetchUsers, toggleBlockUser };
