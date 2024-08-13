import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookComponent = ({ books }) => {
  const navigate = useNavigate();

  const handleClick = (bookId) => {
    navigate(`/story/${bookId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {books.map((book) => (
        <div 
          key={book._id} 
          className="book-card p-4 border rounded-lg shadow-md cursor-pointer"
          onClick={() => handleClick(book._id)}
        >
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
  );
};

export default BookComponent;
