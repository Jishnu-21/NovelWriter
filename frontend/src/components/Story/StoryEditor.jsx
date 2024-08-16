import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateChapter } from '../../features/chapter/chapterSlice';
import axios from 'axios';
import PageComponent from './PageComponent';
import 'react-quill/dist/quill.snow.css';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import {API_URL} from '../../config'

const StoryEditor = ({ chapter }) => {
  const dispatch = useDispatch();
  const [pages, setPages] = useState([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
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
      setPages(prevPages => [
        ...prevPages.slice(0, selectedPageIndex),
        { ...currentPage },
        ...prevPages.slice(selectedPageIndex + 1)
      ]);
    }
  }, [selectedPageIndex]);

  useEffect(() => {
    if (pages.length > 0) {
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

  const handleDeletePage = () => {
    if (pageToDelete !== null) {
      setPages(prevPages => prevPages
        .filter((_, i) => i !== pageToDelete)
        .map((page, i) => ({
          ...page,
          pageIndex: i + 1,
        }))
      );
      setShowConfirmDelete(false);
      setSelectedPageIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }
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
      const response = await axios.put(`${API_URL}/chapters/${chapter._id}`, updatedChapter);
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
    <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
      <header className="px-4 py-2 border-b border-gray-200 sm:px-6 sm:py-4">
        <h2 className="text-xl font-semibold text-gray-800 sm:text-2xl">{chapter.title}</h2>
      </header>
      
      <div className="px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between sm:px-6 sm:py-4">
        <div className="flex-1 flex flex-wrap items-center overflow-x-auto">
          {pages.map((page, index) => (
            <button
              key={page.pageIndex}
              onClick={() => setSelectedPageIndex(index)}
              className={`mr-2 mb-2 px-2 py-1 rounded-lg transition-colors ${
                index === selectedPageIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } text-sm sm:text-base`}
            >
              Page {page.pageIndex}
            </button>
          ))}
        </div>
        <button
          onClick={handleAddPage}
          className="ml-2 px-2 py-1 bg-black text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center text-sm sm:text-base"
        >
          <FaPlus className="mr-1" /> Add
        </button>
      </div>

      {pages.length > 0 && (
        <div className="p-2 sm:p-4">
          <PageComponent
            page={pages[selectedPageIndex]}
            onPageChange={updatedPage => handlePageChange(selectedPageIndex, updatedPage)}
          />
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm w-full">
            <p className="text-lg mb-4">Are you sure you want to delete this page?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1 bg-gray-300 rounded-lg mr-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePage}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="px-4 py-2 border-t border-gray-200 flex justify-between items-center sm:px-6 sm:py-4">
        <button
          onClick={() => {
            setPageToDelete(selectedPageIndex);
            setShowConfirmDelete(true);
          }}
          className={`px-3 py-1 rounded-lg flex items-center ${
            pages.length > 1 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
          } text-white transition-colors text-sm`}
          disabled={pages.length <= 1} // Disable delete button if only one page
        >
          <FaTrash className="mr-1" />
          Delete
        </button>
        <button
          onClick={handleSave}
          className={`px-3 py-1 rounded-lg flex items-center ${
            saving ? 'bg-yellow-500' : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors text-sm`}
        >
          <FaSave className="mr-1" />
          {saving ? 'Saving...' : 'Save'}
        </button>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </footer>
    </div>
  );
};

export default StoryEditor;
