import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBookOpen } from 'react-icons/fa';

const RecommendedStories = ({ userId }) => {
  const [recommendedStories, setRecommendedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendedStories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/story/recommended/${userId}`);
        setRecommendedStories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recommended stories:', error);
        setError('Error fetching recommended stories');
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendedStories();
    }
  }, [userId]);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <FaBookOpen className="mr-2" /> Recommended Stories
      </h3>
      {recommendedStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedStories.map((story) => (
            <div key={story._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
              <img
                src={story.coverPage || 'default-cover.jpg'}
                alt={story.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="font-semibold text-lg">{story.name}</p>
                <p className="text-sm text-gray-600">{story.genre}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No recommendations available based on your interests.</p>
      )}
    </div>
  );
};

export default RecommendedStories;