// src/components/BookDetail/ReviewForm.jsx

import React from 'react';
import { StarIcon } from 'lucide-react';

const ReviewForm = ({ onSubmit, userRating, setUserRating, userReview, setUserReview }) => (
  <form onSubmit={onSubmit} className="mt-6">
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Your Rating</label>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-6 w-6 cursor-pointer ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => setUserRating(star)}
            aria-label={`Rate ${star} stars`}
          />
        ))}
      </div>
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Your Review</label>
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={userReview}
        onChange={(e) => setUserReview(e.target.value)}
        rows="4"
        required
      ></textarea>
    </div>
    <button
      type="submit"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Submit Review
    </button>
  </form>
);

export default ReviewForm;
