import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '../../config'

export const fetchUserData = (userId) => async (dispatch) => {
  try {
    dispatch(fetchUserDataStart());
    const response = await axios.get(`${API_URL}/users/${userId}`);
    dispatch(fetchUserDataSuccess(response.data));
  } catch (error) {
    dispatch(fetchUserDataFailure(error.message));
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails: null,
    userStories: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchUserDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserDataSuccess: (state, action) => {
      state.userDetails = action.payload;
      state.loading = false;
    },
    fetchUserDataFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setUserStories: (state, action) => {
      state.userStories = action.payload;
    },
  },
});

export const {
  fetchUserDataStart,
  fetchUserDataSuccess,
  fetchUserDataFailure,
  setUserStories,
} = userSlice.actions;

export default userSlice.reducer;
