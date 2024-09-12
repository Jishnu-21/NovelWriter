import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoriesThunk, toggleBlockStoryThunk } from '../../features/admin/adminSlice';
import ConfirmationDialog from '../ConfirmationDialog';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Importing the view icon
import { API_URL } from '../../config';

const Stories = () => {
  const dispatch = useDispatch();
  const { stories, loading, error } = useSelector((state) => state.admin);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportDetails, setReportDetails] = useState([]);

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

  const handleReportClick = async (storyId) => {
    try {
      const response = await fetch(`${API_URL}/admin/reports/${storyId}`);
      const data = await response.json();
      setReportDetails(data);
      setReportDialogOpen(true);
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
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
              <TableCell className="text-gray-300">Genre</TableCell>
              <TableCell className="text-gray-300">Status</TableCell>
              <TableCell className="text-gray-300">Reports</TableCell>
              <TableCell className="text-gray-300">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stories.map((story) => (
              <TableRow key={story._id}>
                <TableCell className="text-gray-200">{story.name}</TableCell>
                <TableCell className="text-gray-200">{story.genre}</TableCell>
                <TableCell className="text-gray-200">{story.isBlocked ? 'Blocked' : 'Active'}</TableCell>
                <TableCell>
                  <VisibilityIcon 
                    onClick={() => handleReportClick(story._id)} 
                    color="inherit" 
                    style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickability
                  />
                </TableCell>
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

      <Modal 
        open={reportDialogOpen} 
        onClose={() => setReportDialogOpen(false)}
        aria-labelledby="report-modal-title" 
        aria-describedby="report-modal-description"
      >
        <div className="flex items-center justify-center h-full">
          <div className="p-4 bg-white rounded shadow-lg" style={{ width: '400px' }}>
            <Typography id="report-modal-title" variant="h6" component="h2">
              Reported Users
            </Typography>
            {reportDetails.length > 0 ? (
              <ul>
                {reportDetails.map((report) => (
                  <li key={report._id} className="py-2 border-b">
                    <strong>{report.userId.username}</strong>: {report.reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reports found for this story.</p>
            )}
            <Button onClick={() => setReportDialogOpen(false)} color="primary" variant="contained" style={{ marginTop: '10px' }}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stories;
