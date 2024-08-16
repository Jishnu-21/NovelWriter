import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ConfirmationDialog from '../ConfirmationDialog';
import { FaPlus, FaTrash } from 'react-icons/fa';
import {API_URL} from '../../config'

const ChapterList = ({ onChapterSelect }) => {
  const [chapters, setChapters] = useState([]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState(null);

  const story = useSelector((state) => state.stories.selectedStory);
  const [storyData, setStoryData] = useState(null);

  useEffect(() => {
    setStoryData(story);
  }, [story]);

  useEffect(() => {
    if (storyData && storyData._id) {
      fetchChapters(storyData._id);
    } else {
      setError('No story ID available.');
    }
  }, [storyData]);

  const fetchChapters = async (storyId) => {
    try {
      const response = await axios.get(`${API_URL}/chapters/${storyId}`);
      if (Array.isArray(response.data)) {
        setChapters(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected response format.');
        setChapters([]);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching chapters:', error);
      setError('Failed to fetch chapters. Please try again.');
      setChapters([]);
    }
  };

  const handleCreateChapter = async () => {
    if (newChapterTitle.trim()) {
      try {
        const response = await axios.post(`${API_URL}/chapters`, {
          title: newChapterTitle,
          storyId: storyData._id
        });
        if (response.data && response.data._id) {
          setChapters([...chapters, response.data]);
          setNewChapterTitle('');
          setError(null);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Unexpected response format.');
        }
      } catch (error) {
        console.error('Error creating chapter:', error.response ? error.response.data : error.message);
        setError(`Failed to create chapter. ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      await axios.delete(`${API_URL}/chapters/${chapterId}`);
      setChapters(chapters.filter(chapter => chapter._id !== chapterId));
      setOpenDialog(false);
      setError(null);
    } catch (error) {
      console.error('Error deleting chapter:', error);
      setError('Failed to delete chapter. Please try again.');
    }
  };

  const openDeleteDialog = (chapter) => {
    setChapterToDelete(chapter);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setChapterToDelete(null);
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">Chapters</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="text"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="New chapter title"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateChapter}
          className="w-full sm:w-auto bg-black text-white p-2 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Create
        </button>
      </div>
      {chapters.length > 0 ? (
        <ul className="list-none p-0 flex-grow flex flex-col overflow-y-auto gap-2">
          {chapters.map((chapter) => (
            <li
              key={chapter._id}
              onClick={() => onChapterSelect(chapter)}
              className="cursor-pointer p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
            >
              <span className="text-gray-800 text-sm md:text-base">{chapter.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteDialog(chapter);
                }}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No chapters available. Create a new chapter to get started.</p>
      )}
      <ConfirmationDialog
        open={openDialog}
        handleClose={closeDeleteDialog}
        handleConfirm={() => {
          if (chapterToDelete) {
            handleDeleteChapter(chapterToDelete._id);
          }
        }}
        message={`Are you sure you want to delete the chapter "${chapterToDelete?.title}"?`}
      />
    </div>
  );
};

export default ChapterList;
