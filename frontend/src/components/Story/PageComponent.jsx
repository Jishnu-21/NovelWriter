import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PageComponent = ({ page, onPageChange }) => {
  const handleContentChange = (content) => {
    onPageChange({ ...page, content, pageIndex: page.pageIndex });
  };

  const handleChoiceChange = (index, field, value) => {
    const updatedChoices = page.choices.map((choice, i) =>
      i === index ? { ...choice, [field]: value } : choice
    );
    onPageChange({ ...page, choices: updatedChoices });
  };

  const handleAddChoice = () => {
    if (!page.isEnd) {
      const newChoice = { text: '', nextPageIndex: null };
      onPageChange({ ...page, choices: [...page.choices, newChoice] });
    }
  };

  const handleIsEndChange = (e) => {
    const isEnd = e.target.checked;
    onPageChange({ ...page, isEnd, choices: page.choices });
  };

  return (
    <div className="flex flex-col space-y-4">
      <ReactQuill
        key={page.pageIndex}
        value={page.content}
        onChange={handleContentChange}
        className="h-80 border border-gray-300 rounded-lg"
        placeholder="Page content here..."
      />
      <div>
        <h3 className="text-lg font-semibold">Choices</h3>
        {page.choices.map((choice, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              value={choice.text}
              onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Choice text"
              disabled={page.isEnd} // Disable the text input if it's the last page
            />
            <input
              type="number"
              value={choice.nextPageIndex || ''}
              onChange={(e) => handleChoiceChange(index, 'nextPageIndex', parseInt(e.target.value, 10))}
              className="w-32 p-2 border border-gray-300 rounded-lg"
              placeholder="Next Page Index"
              disabled={page.isEnd} // Disable the number input if it's the last page
            />
          </div>
        ))}
        {!page.isEnd && (
          <button
            onClick={handleAddChoice}
            className="mt-2 px-4 py-2 bg-black text-white rounded-lg"
          >
            Add Choice
          </button>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isEnd"
          checked={page.isEnd}
          onChange={handleIsEndChange}
          className="mr-2"
        />
        <label htmlFor="isEnd">This is the last page</label>
      </div>
    </div>
  );
};

export default PageComponent;
