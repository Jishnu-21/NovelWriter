import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ratingOptions = ['Adult', 'PG13', 'Teen', 'E'];
const sortOptions = ['A-Z', 'Z-A'];

const FilterSection = ({ title, isOpen, onToggle, children }) => (
  <div className="mb-4">
    <button 
      className="font-medium mb-2 flex items-center justify-between w-full"
      onClick={onToggle}
    >
      {title}
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {isOpen && children}
  </div>
);

const FilterComponent = ({ genres, activeGenre, activeRating, activeSort, onFilterChange, onRatingChange, onSortChange }) => {
  const [isGenreOpen, setIsGenreOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isSortOpen, setIsSortOpen] = useState(true);

  return (
    <div className="filters mb-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <FilterSection title="GENRE" isOpen={isGenreOpen} onToggle={() => setIsGenreOpen(!isGenreOpen)}>
        <div className="flex flex-wrap gap-2">
          <button
            key="all-genres"
            className={`px-3 py-1 rounded-full text-sm ${
              activeGenre === 'All' ? 'bg-black text-white' : 'bg-gray-200'
            }`}
            onClick={() => onFilterChange('All')}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre._id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeGenre === genre.name ? 'bg-black text-white' : 'bg-gray-200'
              }`}
              onClick={() => onFilterChange(genre.name)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </FilterSection>
      
      <FilterSection title="RATING" isOpen={isRatingOpen} onToggle={() => setIsRatingOpen(!isRatingOpen)}>
        <div className="flex flex-wrap gap-2">
          <button
            key="all-ratings"
            className={`px-3 py-1 rounded-full text-sm ${
              activeRating === 'All' ? 'bg-black text-white' : 'bg-gray-200'
            }`}
            onClick={() => onRatingChange('All')}
          >
            All
          </button>
          {ratingOptions.map((rating) => (
            <button
              key={rating}
              className={`px-3 py-1 rounded-full text-sm ${
                activeRating === rating ? 'bg-black text-white' : 'bg-gray-200'
              }`}
              onClick={() => onRatingChange(rating)}
            >
              {rating}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="SORT BY" isOpen={isSortOpen} onToggle={() => setIsSortOpen(!isSortOpen)}>
        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <button
              key={option}
              className={`px-3 py-1 rounded-full text-sm ${
                activeSort === option ? 'bg-black text-white' : 'bg-gray-200'
              }`}
              onClick={() => onSortChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterComponent;
