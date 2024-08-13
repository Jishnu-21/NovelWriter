import React, { useState } from 'react';
import ChapterList from './ChapterList';
import StoryEditor from './StoryEditor';

const StoryBoard = ({ storyId }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-72 p-4 bg-white border-r border-gray-300">
        <ChapterList 
          onChapterSelect={handleChapterSelect}
        />
      </div>
      <div className="flex-1 p-6">
        {selectedChapter ? (
          <StoryEditor chapter={selectedChapter} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Select or create a chapter to edit
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryBoard;
