import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const BookDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/story/${id}`);
        setStory(response.data.story);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchStoryDetails();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  const handleClick = () => {
    navigate(`/read/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 md:p-8 lg:p-11 flex-grow">
        {story && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:flex-shrink-0">
                <img
                  src={story.coverPage}
                  alt={story.name}
                  className="w-full h-64 object-cover md:w-64 md:h-80"
                />
              </div>
              <div className="p-4 md:p-6">
                <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{story.name}</h1>
                <p className="text-gray-700 text-base mb-4"><strong>Genre:</strong> {story.genre}</p>
                <p className="text-gray-700 text-base mb-4"><strong>Rating:</strong> {story.rating}</p>
                <p className="text-gray-700 text-base mb-4"><strong>Published:</strong> {story.publishingDate ? new Date(story.publishingDate).toLocaleDateString() : 'Not Published'}</p>
                <p className="text-gray-700 text-base mb-6"><strong>Description:</strong> {story.description}</p>
                <p className="text-gray-700 text-base mb-4"><strong>Author:</strong> {story.author.username}</p>
                <button
                  onClick={handleClick}
                  className="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-full transition duration-200 ease-in-out"
                >
                  Read Me
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BookDetailPage;
