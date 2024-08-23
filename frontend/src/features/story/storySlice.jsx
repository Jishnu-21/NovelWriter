import { createSlice } from '@reduxjs/toolkit';
import { fetchUnpublishedStories, fetchStoryById, deleteStory, createStory, fetchGenres, publishStory } from '../story/storyAction';

const initialState = {
  unpublished: [],
  selectedStory: null,
  chapters: [],
  genres: [],
  status: 'idle', // Use status instead of loading
  error: null,
};

const storySlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    addStory: (state, action) => {
      state.unpublished.push(action.payload);
    },
    setSelectedStory: (state, action) => {
      state.selectedStory = action.payload;
      localStorage.setItem('selectedStory', JSON.stringify(action.payload));
    },
    loadStoryFromLocalStorage: (state) => {
      const story = JSON.parse(localStorage.getItem('selectedStory'));
      if (story) {
        state.selectedStory = story;
      }
    },
    resetStories: (state) => initialState, // Action to reset state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnpublishedStories.pending, (state) => {
        state.status = 'loading'; // Standardize to use status
        state.error = null;
      })
      .addCase(fetchUnpublishedStories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.unpublished = action.payload;
      })
      .addCase(fetchUnpublishedStories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message; // More clarity in error
      })
      .addCase(fetchStoryById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedStory = action.payload;
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGenres.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createStory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.unpublished.push(action.payload);
        state.selectedStory = action.payload;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.unpublished = state.unpublished.filter(
          (story) => story._id !== action.payload
        );
      })
      .addCase(deleteStory.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(publishStory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(publishStory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedStory = action.payload.story;

        state.unpublished = state.unpublished.map(story =>
          story._id === updatedStory._id ? updatedStory : story
        );

        if (state.selectedStory && state.selectedStory._id === updatedStory._id) {
          state.selectedStory = updatedStory;
        }
      })
      .addCase(publishStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addStory, setSelectedStory, loadStoryFromLocalStorage, resetStories } = storySlice.actions;

export default storySlice.reducer;
