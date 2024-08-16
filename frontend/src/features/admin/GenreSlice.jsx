import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import {API_URL} from '../../config'

const API_URL2 = '${API_URL}/admin/genres'; // Update this with your actual API URL

export const fetchGenres = createAsyncThunk('genre/fetchGenres', async () => {
  const response = await axios.get(API_URL2);
  return response.data;
});

export const addGenre = createAsyncThunk('genre/addGenre', async (genreData) => {
  const response = await axios.post(API_URL2, genreData);
  return response.data;
});

export const updateGenre = createAsyncThunk('genre/updateGenre', async ({ id, ...genreData }) => {
  const response = await axios.put(`${API_URL2}/${id}`, genreData);
  return response.data;
});

export const toggleGenreStatus = createAsyncThunk('genre/toggleGenreStatus', async (id) => {
  const response = await axios.patch(`${API_URL2}/${id}/toggle`);
  return response.data;
});

const genreSlice = createSlice({
  name: 'genre',
  initialState: {
    genres: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addGenre.fulfilled, (state, action) => {
        state.genres.push(action.payload);
      })
      .addCase(updateGenre.fulfilled, (state, action) => {
        const index = state.genres.findIndex((genre) => genre._id === action.payload._id);
        if (index !== -1) {
          state.genres[index] = action.payload;
        }
      })
      .addCase(toggleGenreStatus.fulfilled, (state, action) => {
        const index = state.genres.findIndex((genre) => genre._id === action.payload._id);
        if (index !== -1) {
          state.genres[index] = action.payload;
        }
      });
  },
});

export default genreSlice.reducer;
