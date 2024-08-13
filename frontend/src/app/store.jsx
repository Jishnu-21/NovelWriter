import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminSlice'
import genreReducer from '../features/admin/GenreSlice'
import storyReducer from '../features/story/storySlice'
import chapterReducer from '../features/chapter/chapterSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    genre: genreReducer,
    stories: storyReducer,
    chapters: chapterReducer,
  }
});


