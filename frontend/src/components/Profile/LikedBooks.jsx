import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import Sidebar from './Sidebar';
import NavBar from '../NavBar';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BookComponent from '../Gallery/BookComponent'; // Import the BookComponent

const LikedBooks = () => {
  const [likedBooks, setLikedBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(3); // Show 3 books per page
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const userData = user?.user || {};
  const userId = userData.id || user._id;

  useEffect(() => {
    const fetchLikedBooks = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}/liked-books`);
        setLikedBooks(response.data.likedBooks || []); // Ensure it defaults to an array if undefined
        console.log(response.data.likedBooks);
      } catch (error) {
        console.error('Error fetching liked books:', error);
      }
    };

    fetchLikedBooks();
  }, [userId]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = likedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavBar />
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <div className="w-full lg:w-3/4 px-4 mx-auto mt-8 flex flex-col items-start"> {/* Align items to the start (left) */}
          <h1 className="text-3xl mb-6 text-left">Liked Books</h1>
          {likedBooks.length === 0 ? (
            <p className="text-center text-gray-500">No books liked yet.</p> // Message for no liked books
          ) : (
            <>
              <div className="max-w-3xl w-full"> {/* Ensure it takes full width for left alignment */}
                <BookComponent books={currentBooks} /> {/* Use the BookComponent to display books */}
              </div>
              {likedBooks.length > booksPerPage && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.ceil(likedBooks.length / booksPerPage) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default LikedBooks;
