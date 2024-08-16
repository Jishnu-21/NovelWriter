import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers, toggleBlockUser } from './adminService';
import axios from 'axios';
import {API_URL} from '../../config'

export const fetchUsersThunk = createAsyncThunk('admin/fetchUsers', async () => {
  const users = await fetchUsers();
  return users;
});

export const toggleBlockUserThunk = createAsyncThunk('admin/toggleBlockUser', async (userId) => {
  const updatedUser = await toggleBlockUser(userId);
  return updatedUser;
});

export const fetchStoriesThunk = createAsyncThunk('admin/fetchStories', async () => {
  const response = await axios.get(`${API_URL}/admin/stories`); 
  return response.data;
});

export const toggleBlockStoryThunk = createAsyncThunk('admin/toggleBlockStory', async (storyId) => {
  const response = await axios.patch(`${API_URL}/admin/story/${storyId}/block`);
  return response.data;
});



const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    stories: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleBlockUserThunk.fulfilled, (state, action) => {
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(fetchStoriesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleBlockStoryThunk.fulfilled, (state, action) => {
        const updatedStory = action.payload;
        state.stories = state.stories.map((story) =>
          story._id === updatedStory._id ? updatedStory : story
        );
      });
  },
});

export default adminSlice.reducer;
