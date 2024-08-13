import { createSlice } from '@reduxjs/toolkit';
import { fetchUnpublishedStories, fetchStoryById, deleteStory,createStory,fetchGenres,publishStory } from '../story/storyAction';

const initialState = {
  unpublished: [],
  selectedStory: null,
  chapters: [],
  genres: [],
  loading: false,
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
      localStorage.setItem('selectedStory', JSON.stringify(action.payload)); // Save to localStorage
    },
    loadStoryFromLocalStorage: (state) => {
      const story = JSON.parse(localStorage.getItem('selectedStory'));
      if (story) {
        state.selectedStory = story;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnpublishedStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnpublishedStories.fulfilled, (state, action) => {
        state.loading = false;
        state.unpublished = action.payload;
      })
      .addCase(fetchUnpublishedStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStory = action.payload;
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGenres.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.loading = false;
        state.unpublished.push(action.payload);
        state.selectedStory = action.payload;
      })
      .addCase(createStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        console.log('Delete story fulfilled. Payload:', action.payload);
        state.unpublished = state.unpublished.filter(
          (story) => story._id !== action.payload
        );
        console.log('Updated unpublished stories:', state.unpublished);
      })
      .addCase(deleteStory.rejected, (state, action) => {
        console.error('Delete story rejected:', action.payload);
        state.error = action.payload;
      })
      .addCase(publishStory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(publishStory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedStory = action.payload.story;

        if (Array.isArray(state.stories)) {
          state.stories = state.stories.map(story =>
            story._id === updatedStory._id ? updatedStory : story
          );
        }

        if (state.selectedStory && state.selectedStory._id === updatedStory._id) {
          state.selectedStory = updatedStory;
        }
      })
      .addCase(publishStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addStory, setSelectedStory, loadStoryFromLocalStorage } = storySlice.actions;

export default storySlice.reducer;
