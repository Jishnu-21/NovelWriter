import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ConfirmationDialog from '../ConfirmationDialog';

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
      const response = await axios.get(`http://localhost:5000/api/chapters/${storyId}`);
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
        const response = await axios.post('http://localhost:5000/api/chapters', {
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
      await axios.delete(`http://localhost:5000/api/chapters/${chapterId}`);
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
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="New chapter title"
          className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreateChapter}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Chapter
        </button>
      </div>
      {chapters.length > 0 ? (
        <ul className="list-none p-0">
          {chapters.map((chapter) => (
            <li
              key={chapter._id}
              onClick={() => onChapterSelect(chapter)}
              className="cursor-pointer p-3 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex justify-between items-center"
            >
              {chapter.title}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering onChapterSelect
                  openDeleteDialog(chapter);
                }}
                className="text-red-600 hover:text-red-800 transition"
              >
                Delete
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
