import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ReadingHistory = () => {
  const [readingHistory, setReadingHistory] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userData = user?.user || {};
  const userId = userData.id || user._id;
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchReadingHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/reading-history/${userId}`);
        setReadingHistory(response.data.history || []);
      } catch (error) {
        console.error('Error fetching reading history:', error.response ? error.response.data : error.message);
      }
    };

    if (userId) {
      fetchReadingHistory();
    }
  }, [userId]);

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`${API_URL}/reading-history/${userId}/${bookId}`);
      setReadingHistory(readingHistory.filter(entry => entry.bookId._id !== bookId)); // Update local state
    } catch (error) {
      console.error('Error deleting reading history:', error.response ? error.response.data : error.message);
    }
  };

  const handleNavigate = (bookId) => {
    navigate(`/story/${bookId}`); // Navigate to the story details
  };

  return (
    <div className="flex flex-col items-start"> {/* Align items to the right */}
      <h2 className="text-2xl mt-10 mb-4">Reading History</h2>
      {readingHistory.length === 0 ? (
        <p className="text-center text-gray-500">No reading history available.</p>
      ) : (
        <ul className="w-full text-right"> {/* Ensure the list items align to the right */}
          {readingHistory.map(({ bookId, title, dateRead }) => ( // Destructure bookId, title, and dateRead
            <li key={bookId._id} className="mb-2 flex justify-between items-center">
              <span 
                className="cursor-pointer text-blue-600 hover:underline" 
                onClick={() => handleNavigate(bookId._id)} // Click to navigate using bookId._id
              >
                {title}
              </span> 
              - <span>{new Date(dateRead).toLocaleDateString()}</span>
              <button 
                onClick={() => handleDelete(bookId._id)} // Delete using bookId._id
                className="ml-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReadingHistory;
