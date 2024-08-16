import React, { useState, useEffect } from 'react';
import ChapterList from './ChapterList';
import StoryEditor from './StoryEditor';
import { FaBars, FaTimes } from 'react-icons/fa';

const StoryBoard = ({ storyId }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div
        className={`${
          sidebarVisible ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative z-30 md:translate-x-0 w-64 md:w-72 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <ChapterList onChapterSelect={handleChapterSelect} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {sidebarVisible ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </header>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {selectedChapter ? (
            <StoryEditor chapter={selectedChapter} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              <p className="bg-white p-8 rounded-lg shadow-md">
                Select or create a chapter to start editing
              </p>
            </div>
          )}
        </main>
      </div>
      
      {sidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default StoryBoard;