import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUnpublishedStories = createAsyncThunk(
  'stories/fetchUnpublishedStories',
  async (userId, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5000/api/story/unpublished?userId=${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchStoryById = createAsyncThunk(
  'stories/fetchStoryById',
  async (storyId, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/story/${storyId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchChaptersByStoryId = createAsyncThunk(
  'stories/fetchChaptersByStoryId',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chapters/${storyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (storyId, { rejectWithValue }) => {
    try {
      console.log('Attempting to delete story with ID:', storyId);
      const response = await axios.delete(`http://localhost:5000/api/story/${storyId}`);
      console.log('Delete response:', response);
      return storyId;
    } catch (error) {
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
        return rejectWithValue('No response received from server');
      } else {
        console.error('Error message:', error.message);
        console.error('Error config:', error.config);
        return rejectWithValue('Error setting up the request: ' + error.message);
      }
    }
  }
);


export const createStory = createAsyncThunk(
  'stories/createStory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/story/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data.story;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'An error occurred');
      } else if (error.request) {
        return rejectWithValue('No response received from server');
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const fetchGenres = createAsyncThunk(
  'stories/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/story/genres');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch genres');
    }
  }
);

export const publishStory = createAsyncThunk(
  'stories/publishStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/story/publish/${storyId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);