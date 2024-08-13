import axios from 'axios';

export const addInterest = (userId, interests) => async (dispatch) => {
  try {
    const response = await axios.post(`http://localhost:5000/api/users/${userId}/interests`, {
      interests
    });

    dispatch({ type: 'UPDATE_USER', payload: response.data }); // Replace with your action type
  } catch (error) {
    console.error('Error updating interests:', error);
  }
};
