import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from '@mui/material';

const SEND_MESSAGE = gql`
  mutation SendMessage($messages: [MessageInput!]!) {
    sendMessage(messages: $messages) {
      role
      content
    }
  }
`;

const StoryReader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialContent, characters, outline, genre } = location.state || {};

  const [storyParts, setStoryParts] = useState([initialContent]);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [showBackButton, setShowBackButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleOverlayClick = (direction) => {
    if (direction === 'next' && currentPartIndex < storyParts.length - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
    } else if (direction === 'prev' && currentPartIndex > 0) {
      setCurrentPartIndex(currentPartIndex - 1);
    }
  };

  const handleContinueStory = async (input = '') => {
    setIsGenerating(true);
    setOpenDialog(false);

    const messages = [
      { role: 'user', content: `Characters: ${JSON.stringify(characters)}` },
      { role: 'user', content: `Basic Outline: ${outline}` },
      { role: 'user', content: `Genre: ${genre}` },
      ...storyParts.map(part => ({ role: 'assistant', content: part })),
      { role: 'user', content: input || 'Continue the story. Keep it brief and end with a cliffhanger or a point where the user can make a decision.' },
    ];

    try {
      const { data } = await sendMessage({ variables: { messages } });
      const newContent = data.sendMessage.content;
      setStoryParts([...storyParts, newContent]);

      if (newContent.toLowerCase().includes('the end')) {
        setShowContinueButton(false); 
      }

      setCurrentPartIndex(storyParts.length);
    } catch (error) {
      console.error('Error continuing story:', error);
    } finally {
      setIsGenerating(false);
      setUserInput('');
    }
  };

  return (
    <div 
      className="w-full h-screen flex flex-col bg-gray-100 relative"
      onMouseEnter={() => setShowBackButton(true)}
      onMouseLeave={() => setShowBackButton(false)}
    >
      {showBackButton && (
        <div 
          className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200 z-50"
          onClick={handleBackButtonClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5m6 10l5-5-5-5" />
          </svg>
        </div>
      )}
      <div className="flex-1 flex items-center justify-center relative">
        <div 
          className="absolute inset-y-0 left-0 w-1/4 bg-transparent cursor-pointer" 
          onClick={() => handleOverlayClick('prev')}
        />
        <div 
          className="absolute inset-y-0 right-0 w-1/4 bg-transparent cursor-pointer" 
          onClick={() => handleOverlayClick('next')}
        />
        <div className="w-full max-w-4xl p-6 bg-white shadow-lg rounded-lg">
          <div className="overflow-y-auto">
            <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {storyParts[currentPartIndex]}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpenDialog(true)}
                disabled={isGenerating}
              >
                Provide Input
              </Button>
            </Box>
          </div>
        </div>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Provide Input for the Next Part</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your input"
            type="text"
            fullWidth
            variant="outlined"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => handleContinueStory(userInput)}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StoryReader;
