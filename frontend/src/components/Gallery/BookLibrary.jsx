import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import BookComponent from './BookComponent';
import Pagination from './Pagination'; 

const BookLibrary = ({ searchTerm }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 9;
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeRating, setActiveRating] = useState('All');
  const [activeSort, setActiveSort] = useState('A-Z'); // Corrected to 'A-Z'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, genresResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/story/published'),
          axios.get('http://localhost:5000/api/story/genres')
        ]);
        setBooks(booksResponse.data);
        setFilteredBooks(booksResponse.data);
        setGenres(genresResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = books.filter(book => 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeGenre !== 'All') {
      results = results.filter(book => book.genre === activeGenre);
    }

    if (activeRating !== 'All') {
      results = results.filter(book => book.rating === activeRating);
    }

    if (activeSort === 'A-Z') {
      results = results.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      results = results.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredBooks(results);
    setCurrentPage(1);
  }, [searchTerm, books, activeGenre, activeRating, activeSort]);

  const handleFilterChange = (genre) => {
    setActiveGenre(genre);
  };

  const handleRatingChange = (rating) => {
    setActiveRating(rating);
  };

  const handleSortChange = (sortOrder) => {
    setActiveSort(sortOrder);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <FilterComponent 
            genres={genres}
            activeGenre={activeGenre}
            activeRating={activeRating}
            activeSort={activeSort}
            onFilterChange={handleFilterChange} 
            onRatingChange={handleRatingChange}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="w-full md:w-3/4">
          <BookComponent books={currentBooks} />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default BookLibrary;
