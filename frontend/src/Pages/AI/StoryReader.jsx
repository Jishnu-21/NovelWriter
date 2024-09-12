import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import {
  Button,
  Typography,
  CircularProgress,
  Switch,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Client } from "@gradio/client";
import { Toaster, toast } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

const SEND_MESSAGE = gql`
  mutation SendMessage($messages: [MessageInput!]!) {
    sendMessage(messages: $messages) {
      role
      content
    }
  }
`;

export default function StoryReader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { initialContent, characters, outline, genre, imageStyle } = location.state || {};
  const { darkMode, toggleDarkMode } = useTheme();

  const [storyParts, setStoryParts] = useState([initialContent]);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [isInitialImageGenerated, setIsInitialImageGenerated] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const MAX_PAGES = 12

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const generateImage = async (content) => {
    setIsImageLoading(true);
    try {
      const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
      const result = await client.predict("/infer", {
        prompt: `${imageStyle} style illustration of: ${content}`,
        seed: 0,
        randomize_seed: true,
        width: 1280,
        height: 720,
        num_inference_steps: 4,
      });

      if (result && result.data && result.data[0] && result.data[0].url) {
        setIsImageLoading(false);
        return result.data[0].url;
      }
      throw new Error('Failed to generate image');
    } catch (error) {
      setIsImageLoading(false);
      toast.error('Failed to generate image. Please try again.');
      console.error('Error generating image:', error);
      return null;
    }
  };

  const handleContinueStory = async () => {
    if (storyParts.length >= MAX_PAGES) {
      return;
    }
  
    setIsGenerating(true);
  
    const messages = [
      { role: 'user', content: `Characters: ${JSON.stringify(characters)}` },
      { role: 'user', content: `Basic Outline: ${outline}` },
      { role: 'user', content: `Genre: ${genre}` },
      ...storyParts.map(part => ({ role: 'assistant', content: part })),
      { role: 'user', content: 'Continue the story. Write a complete page that ends at a natural break point. Use vivid descriptions and engaging dialogue to bring the story to life.' },
    ];
  
    try {
      const { data } = await sendMessage({ variables: { messages } });
      const newContent = data.sendMessage.content;
  
      setStoryParts(prevParts => [...prevParts, newContent]);
  
      const newImageUrl = await generateImage(newContent);
      if (newImageUrl) {
        setImageUrls(prevUrls => [...prevUrls, newImageUrl]);
      }
  
      setCurrentPartIndex(prevIndex => prevIndex + 1);
    } catch (error) {
      toast.error('Error continuing story. Please try again.');
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

  const handleGoForward = () => {
    if (currentPartIndex < storyParts.length - 1) {
      setCurrentPartIndex(currentPartIndex + 1);
    } else if (currentPartIndex === storyParts.length - 1 && storyParts.length < MAX_PAGES) {
      handleContinueStory();
    }
  };

  useEffect(() => {
    const generateInitialImage = async () => {
      if (!isInitialImageGenerated && imageUrls.length === 0) {
        const initialImageUrl = await generateImage(initialContent);
        if (initialImageUrl) {
          setImageUrls([initialImageUrl]);
          setIsInitialImageGenerated(true);
        }
      }
    };
  
    generateInitialImage();
  }, []);

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} p-4 sm:p-6 md:p-8 lg:p-10`}>
      <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} />
      <div className={`max-w-4xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBackButtonClick}
              className={darkMode ? 'text-white' : 'text-black'}
            >
              Back to Home
            </Button>
            <div className="flex items-center">
              <Brightness7Icon className={darkMode ? 'text-gray-400' : 'text-yellow-500'} />
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                color="primary"
              />
              <Brightness4Icon className={darkMode ? 'text-blue-300' : 'text-gray-400'} />
            </div>
          </div>

          <div className={`relative w-full h-64 sm:h-80 md:h-96 mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}>
            {isImageLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <CircularProgress color={darkMode ? 'secondary' : 'primary'} />
              </div>
            ) : imageUrls[currentPartIndex] ? (
              <img 
                src={imageUrls[currentPartIndex]} 
                alt={`Generated ${imageStyle} style illustration for part ${currentPartIndex + 1}`} 
                className="w-full h-full object-cover rounded"
                onLoad={() => setIsImageLoading(false)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Typography variant="body2" color={darkMode ? 'textSecondary' : 'textPrimary'}>
                  No image available
                </Typography>
              </div>
            )}
          </div>
          
          <Typography variant="body1" component="div" className={`prose max-w-none mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            {storyParts[currentPartIndex]}
          </Typography>

          <div className="flex justify-between items-center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              disabled={currentPartIndex === 0}
              className={darkMode ? 'text-white' : 'text-black'}
            >
              Previous
            </Button>

            <Button
              endIcon={isGenerating ? <CircularProgress size={20} /> : <ArrowForwardIcon />}
              variant="contained"
              color={darkMode ? 'secondary' : 'primary'}
              onClick={handleGoForward}
              disabled={isGenerating || (currentPartIndex === storyParts.length - 1 && storyParts.length >= MAX_PAGES)}
            >
              {isGenerating ? 'Generating...' : (currentPartIndex < storyParts.length - 1 ? 'Next' : 'Continue Story')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}