import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import { setSelectedStory } from '../../features/story/storySlice';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import { fetchUnpublishedStories, deleteStory } from '../../features/story/storyAction';
import ConfirmationDialog from '../../components/ConfirmationDialog'; 

const UnpublishedStories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unpublished: unpublishedStories, loading, error } = useSelector((state) => state.stories);

  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false); 
  const [storyToDelete, setStoryToDelete] = useState(null); 
  const storiesPerPage = 6;

  // Check if user exists and has _id or user.id
  const userId = user ? (user._id || (user.user && user.user.id)) : null;
  console.log('User:', user);
  console.log('UserID:', userId);
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchUnpublishedStories(userId));
    } else {
      console.error('User ID is not available');
    }
  }, [userId, dispatch]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleContinueWriting = (story) => {
    dispatch(setSelectedStory(story));
    navigate(`/story-writing/${story._id}`);
  };

  const handleDeleteStoryClick = (story) => {
    setStoryToDelete(story);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (storyToDelete) {
      try {
        const result = await dispatch(deleteStory(storyToDelete._id)).unwrap();
        console.log('Delete result:', result);
        // Refresh the stories list
        dispatch(fetchUnpublishedStories(userId));
      } catch (error) {
        console.error('Error deleting story:', error);
        alert(`Failed to delete story: ${error.message}`);
      } finally {
        setDialogOpen(false);
        setStoryToDelete(null);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setStoryToDelete(null);
  };

  const totalPages = Math.ceil(unpublishedStories.length / storiesPerPage);
  const displayStories = unpublishedStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  return (
    <>
      <NavBar />
      <div className="min-h-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Stories</h1>
        <div className="flex justify-end mb-6">
          <Link
            to="/writing"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            New Story
          </Link>
        </div>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {unpublishedStories.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {displayStories.map((story) => (
                <div key={story._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col">
                  <img
                    src={story.coverPage || 'default-cover.jpg'}
                    alt={story.name}
                    className="w-full h-40 object-cover mb-4 rounded-md"
                  />
                  <h2 className="text-xl font-semibold mb-2">{story.name}</h2>
                  <div className="mt-auto flex justify-between">
                    <button
                      onClick={() => handleContinueWriting(story)}
                      className="text-blue-500 hover:underline"
                    >
                      Continue Writing
                    </button>
                    <button
                      onClick={() => handleDeleteStoryClick(story)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-center">
            No unpublished stories found.
          </p>
        )}
      </div>
      <Footer />

      <ConfirmationDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this story?"
      />
    </>
  );
};

export default UnpublishedStories;
