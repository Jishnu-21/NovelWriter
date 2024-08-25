import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Client } from "@gradio/client";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const MAX_PAGES = 12; // Set the maximum number of pages for the story

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleContinueStory = async () => {
    // Check if the story has reached the maximum number of pages
    if (storyParts.length >= MAX_PAGES) {
      return;
    }

    setIsGenerating(true);

    const messages = [
      { role: 'user', content: `Characters: ${JSON.stringify(characters)}` },
      { role: 'user', content: `Basic Outline: ${outline}` },
      { role: 'user', content: `Genre: ${genre}` },
      ...storyParts.map(part => ({ role: 'assistant', content: part })),
      { role: 'user', content: 'Continue the story. Keep it brief.' },
    ];

    try {
      const { data } = await sendMessage({ variables: { messages } });
      const newContent = data.sendMessage.content;

      // Update story parts and image URLs
      setStoryParts(prevParts => [...prevParts, newContent]);

      // Generate image based on the new content
      const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
      const result = await client.predict("/infer", {
        prompt: newContent,
        seed: 0,
        randomize_seed: true,
        width: 1280,
        height: 720,
        num_inference_steps: 1,
      });

      if (result && result.data && result.data[0] && result.data[0].url) {
        setImageUrls(prevUrls => [...prevUrls, result.data[0].url]);
      }

      setCurrentPartIndex(prevIndex => prevIndex + 1);
    } catch (error) {
      console.error('Error continuing story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoBack = () => {
    if (currentPartIndex > 0) {
      setCurrentPartIndex(currentPartIndex - 1);
    }
  };

  useEffect(() => {
    // Generate image for the initial content
    const generateInitialImage = async () => {
      const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
      const result = await client.predict("/infer", {
        prompt: initialContent,
        seed: 0,
        randomize_seed: true,
        width: 1280,
        height: 720,
        num_inference_steps: 2,
      });

      if (result && result.data && result.data[0] && result.data[0].url) {
        setImageUrls([result.data[0].url]);
      }
    };

    generateInitialImage();
  }, [initialContent]);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackButtonClick}
            className="mb-4"
          >
            Back to Home
          </Button>

          {/* Display the generated image */}
          {imageUrls[currentPartIndex] && (
            <img 
              src={imageUrls[currentPartIndex]} 
              alt={`Generated for part ${currentPartIndex + 1}`} 
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded mb-4"
            />
          )}
          
          <Typography variant="body1" component="div" className="prose max-w-none mb-6">
            {storyParts[currentPartIndex]}
          </Typography>

          <div className="flex justify-between items-center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              disabled={currentPartIndex === 0}
            >
              Previous
            </Button>

            {/* Only show the continue button if the story hasn't reached the maximum pages */}
            {storyParts.length < MAX_PAGES && (
              <Button
                endIcon={isGenerating ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
                variant="contained"
                color="primary"
                onClick={handleContinueStory}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Continue Story'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
