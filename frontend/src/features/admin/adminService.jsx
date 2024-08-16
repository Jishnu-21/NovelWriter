import axios from 'axios';

import {API_URL} from '../../config'

const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

const toggleBlockUser = async (userId) => {
  const response = await axios.patch(`${API_URL}/users/${userId}/block`);
  return response.data;
};

export { fetchUsers, toggleBlockUser };
