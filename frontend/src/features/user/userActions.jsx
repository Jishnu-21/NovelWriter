import axios from 'axios';
import {API_URL} from '../../config'

export const addInterest = (userId, interests) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/interests`, {
      interests
    });

    dispatch({ type: 'UPDATE_USER', payload: response.data }); // Replace with your action type
  } catch (error) {
    console.error('Error updating interests:', error);
  }
};
