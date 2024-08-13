import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chapters: [],
  selectedChapter: null,
};

const chapterSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    setChapters: (state, action) => {
      state.chapters = action.payload;
    },
    addChapter: (state, action) => {
      state.chapters.push(action.payload);
    },
    updateChapter: (state, action) => {
      const index = state.chapters.findIndex(chapter => chapter._id === action.payload._id);
      if (index !== -1) {
        state.chapters[index] = action.payload;
        // If the updated chapter is the selected chapter, update it as well
        if (state.selectedChapter && state.selectedChapter._id === action.payload._id) {
          state.selectedChapter = action.payload;
        }
      }
    },
    deleteChapter: (state, action) => {
      state.chapters = state.chapters.filter(chapter => chapter._id !== action.payload);
      // If the deleted chapter was the selected chapter, clear the selection
      if (state.selectedChapter && state.selectedChapter._id === action.payload) {
        state.selectedChapter = null;
      }
    },
    setSelectedChapter: (state, action) => {
      state.selectedChapter = action.payload;
    },
  },
});

export const { setChapters, addChapter, updateChapter, deleteChapter, setSelectedChapter } = chapterSlice.actions;

export default chapterSlice.reducer;