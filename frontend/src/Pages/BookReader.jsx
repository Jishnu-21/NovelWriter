import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { SunIcon, MoonIcon } from '@heroicons/react/outline'; // Assuming you are using Heroicons

const BookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageHistory, setPageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const response = await axios.get(`${API_URL}/chapters/${id}`);
        setChapter(response.data[0]);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chapter:', err);
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchChapter();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  if (!chapter || !chapter.pages || chapter.pages.length === 0) return <div className="flex items-center justify-center h-screen">No chapter content found</div>;

  const currentPage = chapter.pages[currentPageIndex];

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPageIndex < chapter.pages.length - 1 && !currentPage.isEnd) {
      setPageHistory(prev => [...prev, currentPageIndex]);
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (direction === 'prev' && pageHistory.length > 0) {
      const previousPageIndex = pageHistory[pageHistory.length - 1];
      setPageHistory(prev => prev.slice(0, -1));
      setCurrentPageIndex(previousPageIndex);
    }
  };

  const handleChoiceClick = (nextPageIndex) => {
    if (nextPageIndex) {
      setPageHistory(prev => [...prev, currentPageIndex]);
      setCurrentPageIndex(nextPageIndex - 1);
    }
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const handleOverlayClick = (direction) => {
    if (direction === 'next') {
      if (!currentPage.isEnd && (currentPage.choices?.length === 0 || !currentPage.choices.some(choice => choice.nextPageIndex))) {
        handlePageChange('next');
      }
    } else if (direction === 'prev') {
      handlePageChange('prev');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <div
      className={`w-full h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} relative`}
      onMouseEnter={() => setShowBackButton(true)}
      onMouseLeave={() => setShowBackButton(false)}
    >
      <div className="flex justify-between items-center p-4">
        {/* Back Button */}
        {showBackButton && (
          <div
            className=" rounded-full p-2 cursor-pointer hover:bg-gray-200 transition-colors duration-200 z-50"
            onClick={handleBackButtonClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5m6 10l5-5-5-5" />
            </svg>
          </div>
        )}
        {/* Dark Mode Toggle */}
        <button
          className="p-2 rounded-full hover:bg-gray-400 transition-colors duration-200"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div
          className="absolute inset-y-0 left-0 w-1/4 bg-transparent cursor-pointer"
          onClick={() => handleOverlayClick('prev')}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/4 bg-transparent cursor-pointer"
          onClick={() => handleOverlayClick('next')}
        />
        <div className={`w-full max-w-4xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg`}>
          <div className="overflow-y-auto max-h-[80vh]">
            <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: currentPage.content }} />
            {currentPage.choices && currentPage.choices.length > 0 ? (
              <div className="space-y-2 mt-4">
                {currentPage.choices
                  .filter(choice => choice.nextPageIndex)
                  .map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleChoiceClick(choice.nextPageIndex)}
                      className={`block w-full text-left p-2 rounded transition-colors duration-200 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      {choice.text}
                    </button>
                  ))}
              </div>
            ) : (
              <div className="flex justify-between mt-4">
                {pageHistory.length > 0 && (
                  <div
                    className={`w-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:bg-gray-200 cursor-pointer transition-colors duration-200 flex items-center justify-center rounded`}
                    onClick={() => handlePageChange('prev')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
