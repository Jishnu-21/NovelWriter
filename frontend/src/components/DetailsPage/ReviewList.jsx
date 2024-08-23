import React from 'react';
import { StarIcon } from 'lucide-react';

const ReviewList = ({ reviews, onEdit, onDelete, currentUserId }) => (
  <div>
    {reviews.map((review) => (
      <div key={review._id} className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`h-5 w-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600">{review.userId.username}</span>
        </div>
        <p className="text-gray-700">{review.comment}</p>
        <div className="flex mt-2">
          {/* Show edit and delete buttons only if the review is by the current user */}
          {review.userId._id === currentUserId && (
            <>
              {onEdit && (
                <button onClick={() => onEdit(review)} className="text-blue-500 mr-2">
                  Edit
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(review._id)} className="text-red-500">
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    ))}
  </div>
);

export default ReviewList;
