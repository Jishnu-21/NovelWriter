import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoriesThunk, toggleBlockStoryThunk } from '../../features/admin/adminSlice';
import ConfirmationDialog from '../ConfirmationDialog';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Stories = () => {
  const dispatch = useDispatch();
  const { stories, loading, error } = useSelector((state) => state.admin);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    dispatch(fetchStoriesThunk());
  }, [dispatch]);

  const handleToggleStoryStatus = (story) => {
    setSelectedStory(story);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (selectedStory) {
      dispatch(toggleBlockStoryThunk(selectedStory._id));
    }
    setConfirmDialogOpen(false);
  };

  if (loading) {
    return <p className="text-white">Loading stories...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading stories: {error}</p>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2 className="text-2xl font-semibold mb-4">Stories</h2>
      <TableContainer component={Paper} className="bg-gray-900">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-gray-300">Title</TableCell>
              <TableCell className="text-gray-300">Author</TableCell>
              <TableCell className="text-gray-300">Genre</TableCell>
              <TableCell className="text-gray-300">Status</TableCell>
              <TableCell className="text-gray-300">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story._id}>
                <TableCell className="text-gray-200">{story.name}</TableCell>
                <TableCell className="text-gray-200">{story.author.username}</TableCell>
                <TableCell className="text-gray-200">{story.genre}</TableCell>
                <TableCell className="text-gray-200">{story.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleToggleStoryStatus(story)}
                    color={story.isBlocked ? 'primary' : 'secondary'}
                  >
                    {story.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmationDialog
        open={confirmDialogOpen}
        handleClose={() => setConfirmDialogOpen(false)}
        handleConfirm={handleConfirmAction}
        message={`Are you sure you want to ${selectedStory?.isBlocked ? 'unblock' : 'block'} this story?`}
      />
    </div>
  );
};

export default Stories;
