import React from 'react';

const ChoiceComponent = ({ choice, choiceIndex, pageIndex, onChoiceChange, allPages }) => {
  const handleTextChange = (e) => {
    onChoiceChange(choiceIndex, { ...choice, text: e.target.value });
  };

  const handleNextPageChange = (e) => {
    const selectedPageId = e.target.value;

    // Find the selected page using its ID
    const selectedPage = allPages.find(page => page._id === selectedPageId || page.id === selectedPageId);
    
    if (selectedPage) {
      // Save the existing page ID to nextPageId
      onChoiceChange(choiceIndex, { ...choice, nextPageId: selectedPage._id || selectedPage.id });
    }
  };

  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={choice.text}
        onChange={handleTextChange}
        className="flex-grow p-2 border border-gray-300 rounded-lg mr-2"
      />
      <select
        value={choice.nextPageId || ''}
        onChange={handleNextPageChange}
        className="p-2 border border-gray-300 rounded-lg mr-2"
      >
        <option value="">Select next page</option>
        {allPages.map((p, i) => (
          <option key={p._id || p.id} value={p._id || p.id} disabled={i === pageIndex}>
            Page {i + 1} {i === pageIndex ? '(current)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ChoiceComponent;
