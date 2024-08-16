import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {API_URL} from '../../config'

const RecommendedBooks = () => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const userData = user?.user || {};
  const userId = userData.id || user?._id;
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {

    const fetchUserData = async () => {
        if (!userId) return; // Exit if userId is not available
  
        try {
          const response = await fetch(`${API_URL}/users/${userId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };


    const fetchRecommendedBooks = async () => {
      if (userDetails && userDetails.interests && userDetails.interests.length > 0) {
        try {
          const response = await axios.get(`${API_URL}/story/recommended`, {
            params: { interests: userDetails.interests.join(',') },
          });
          setRecommendedBooks(response.data.slice(0, 3)); // Limit to 3 books
        } catch (error) {
          console.error('Error fetching recommended books:', error);
        }
      }
    };

    fetchRecommendedBooks();
  }, [userDetails]);

  if (!userDetails || !userDetails.interests || userDetails.interests.length === 0) {
    return null; 
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recommendedBooks.map((book) => (
          <div key={book._id} className="book-card p-4 border rounded-lg shadow-md">
            <img 
              src={book.coverPage} 
              alt={book.title} 
              className="object-cover rounded-lg mb-2 w-full h-60" 
            />
            <h3 className="font-semibold text-sm truncate">{book.name}</h3>
            <p className="text-xs text-gray-600">{book.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedBooks;