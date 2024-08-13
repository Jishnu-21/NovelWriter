import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateChapter } from '../../features/chapter/chapterSlice';
import axios from 'axios';
import PageComponent from './PageComponent';
import 'react-quill/dist/quill.snow.css';

const StoryEditor = ({ chapter }) => {
  const dispatch = useDispatch();
  const [pages, setPages] = useState([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
  
    if (chapter && chapter.pages) {
      const initialPages = chapter.pages.map((page, index) => ({
        ...page,
        pageIndex: index + 1,
      }));
      setPages(initialPages);
    }
  
    return () => {
      isMounted.current = false;
    };
  }, [chapter]);

  useEffect(() => {
    if (pages.length > 0 && selectedPageIndex < pages.length) {
      const currentPage = pages[selectedPageIndex];
      // Force a re-render of the PageComponent when the selected page changes
      setPages(prevPages => [
        ...prevPages.slice(0, selectedPageIndex),
        { ...currentPage },
        ...prevPages.slice(selectedPageIndex + 1)
      ]);
    }
  }, [selectedPageIndex]);


  

  useEffect(() => {
    if (pages.length > 0) {
      // Ensure the content is updated when the selected page changes
      setSelectedPageIndex(prevIndex => Math.min(prevIndex, pages.length - 1));
    }
  }, [pages]);

  const handleAddPage = () => {
    const newPage = {
      pageIndex: pages.length + 1,
      content: '',
      choices: [
        { text: 'Choice 1', nextPageIndex: null },
        { text: 'Choice 2', nextPageIndex: null }
      ],
      isEnd: false
    };
    setPages(prevPages => [...prevPages, newPage]);
    setSelectedPageIndex(pages.length);
  };

  const handlePageChange = (index, updatedPage) => {
    setPages(prevPages => prevPages.map((page, i) => 
      i === index ? { ...page, ...updatedPage } : page
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
  
    const updatedChapter = {
      ...chapter,
      pages: pages.map(page => ({
        content: page.content,
        choices: page.choices.map(choice => ({
          text: choice.text,
          nextPageIndex: choice.nextPageIndex || null,
        })),
        pageIndex: page.pageIndex,
        isEnd: page.isEnd
      })),
    };
    
    try {
      const response = await axios.put(`http://localhost:5000/api/chapters/${chapter._id}`, updatedChapter);
      if (isMounted.current) {
        dispatch(updateChapter(response.data));
        setSaving(false);
      }
    } catch (err) {
      console.error('Error saving chapter:', err);
      if (isMounted.current) {
        setError('Failed to save chapter. Please try again.');
        setSaving(false);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{chapter.title}</h2>
      
      <div className="mb-4 flex flex-wrap">
        {pages.map((page, index) => (
          <button
            key={page.pageIndex}
            onClick={() => setSelectedPageIndex(index)}
            className={`mr-2 mb-2 px-4 py-2 rounded-lg ${
              index === selectedPageIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Page {page.pageIndex}
          </button>
        ))}
        <button
          onClick={handleAddPage}
          className="ml-2 px-4 py-2 bg-black text-white rounded-lg"
        >
          Add Page
        </button>
      </div>

      {pages.length > 0 && (
        <div className="mb-4">
          <PageComponent
            page={pages[selectedPageIndex]}
            onPageChange={updatedPage => handlePageChange(selectedPageIndex, updatedPage)}
          />
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg ${
            saving ? 'bg-yellow-500' : 'bg-blue-500'
          } text-white`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        {error && (
          <div className="text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
};

export default StoryEditor;
