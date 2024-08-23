// components/DetailsPage/ReportModal.jsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ReportModal = ({ isOpen, onRequestClose, onReport }) => {
  const [reportReason, setReportReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (reportReason) {
      onReport(reportReason);
      setReportReason('');
      onRequestClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onRequestClose}
      aria-labelledby="report-story-title"
      aria-describedby="report-story-description"
    >
      <Box sx={style}>
        <Typography id="report-story-title" variant="h6" component="h2" gutterBottom>
          Report Story
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            id="report-reason"
            label="Reason for Reporting"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            Submit Report
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ReportModal; 
