import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from '../config';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { StarIcon, HeartIcon, FlagIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/Alert'; // Import your alert components
import ReportModal from '../components/DetailsPage/ReportModal';
import { EditIcon, TrashIcon } from 'lucide-react'; // Import your icons

const ReviewForm = ({ onSubmit, userRating, setUserRating, userReview, setUserReview ,isEditing }) => (
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
      {isEditing ? 'Update Review' : 'Submit Review'}
      </button>
  </form>
);

const ReviewList = ({ reviews }) => (
  <div>
    {reviews.length === 0 ? ( // Check if there are no reviews
      <p className="text-gray-600">No reviews yet.</p>
    ) : (
      reviews.map((review) => (
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
            <span className="ml-2 text-gray-600">
              {review.userId.username} {/* Displaying the username */}
            </span>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))
    )}
  </div>
);


const BookDetailPage = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // State for the report modal
  const [alert, setAlert] = useState({ message: '', type: '', visible: false }); // State for alerts
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.user?.id || user?._id;
  const storedToken = localStorage.getItem('token');
  const token = user?.token || storedToken;

  useEffect(() => {
    const fetchStoryDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/story/${id}`);
        setStory(response.data.story);
        setIsLiked(response.data.story.likes.some(like => like.userId === currentUserId));
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStoryDetails();
  }, [id, currentUserId]);
  

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Average rating with one decimal
  };

  const handleAuthorClick = (e) => {
    e.preventDefault();
    
    if (!currentUserId) {
      return; // Do nothing if the user is not logged in
    }
    
    navigate(story.author._id === currentUserId ? '/profile' : `/author/${story.author._id}`);
  };
  
  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_URL}/story/${id}/like`, { userId: currentUserId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(!isLiked);
      setStory(prev => ({
        ...prev,
        likes: isLiked 
          ? prev.likes.filter(like => like.userId !== currentUserId)
          : [...prev.likes, { userId: currentUserId }]
      }));
    } catch (error) {
      console.error('Error toggling like:', error.response.data.message); // Log the error message for better insights
    }
  };

  const handleEditClick = (review) => {
    setIsEditing(true);
    setCurrentReview(review);
    setUserRating(review.rating);
    setUserReview(review.comment);
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (userRating === 0 || userReview.trim() === '') return; // Simple validation
    try {
      const response = await axios.post(
        `${API_URL}/story/${id}/review`,
        { rating: userRating, comment: userReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Add the new review to the story's review list
      setStory((prev) => ({
        ...prev,
        reviews: [...prev.reviews, response.data.review], // Add the new review
      }));
  
      // Reset form state
      setUserRating(0);
      setUserReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  
  const handleReport = async (reason) => {
    try {
      await axios.post(`${API_URL}/report/${id}/report`, { reason }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ message: 'Thank you for your report.', type: 'success', visible: true });
    } catch (error) {
      setAlert({ message: 'Error reporting story. Please try again.', type: 'error', visible: true });
      console.error('Error reporting story:', error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
const [currentReview, setCurrentReview] = useState(null); // To hold the existing review data


const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.put(`${API_URL}/story/${id}/review/${currentReview._id}`, {
      rating: userRating,
      comment: userReview,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Update the story reviews state with the edited review
    setStory((prev) => ({
      ...prev,
      reviews: prev.reviews.map((rev) =>
        rev._id === currentReview._id ? response.data.review : rev
      ),
    }));
    setIsEditing(false);
    setUserRating(0);
    setUserReview('');
  } catch (error) {
    console.error('Error editing review:', error);
  }
};

const handleDeleteClick = async (reviewId) => {
  try {
    // Pass both storyId and reviewId correctly
    await axios.delete(`${API_URL}/story/${id}/review/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStory((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((review) => review._id !== reviewId),
    }));
    setIsEditing(false);
    setUserRating(0);
    setUserReview('');
  } catch (error) {
    console.error('Error deleting review:', error);
  }
};
  const closeAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  const averageRating = calculateAverageRating(story.reviews); 

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-4 flex-grow">
        {alert.visible && (
          <Alert>
            <AlertDescription>
              {alert.message}
              <button onClick={closeAlert} className="ml-4 underline">Close</button>
            </AlertDescription>
          </Alert>
        )}
  {story && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  src={story.coverPage}
                  alt={story.name}
                  className="w-full h-64 object-cover md:w-64 md:h-auto"
                />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2">{story.name}</h2>
                <p className="text-gray-600 mb-2">Genre: {story.genre}</p>
                <p className="text-gray-600 mb-4">
  Author: 
  {currentUserId ? (
    <span onClick={handleAuthorClick} className="text-blue-500 cursor-pointer">
      {story.author.username}
    </span>
  ) : (
    <span className="text-gray-600">{story.author.username}</span> // Render as plain text
  )}
</p>
                <p className="text-gray-700">{story.description}</p>
                <div className="mt-6 flex items-center">
                  <button
                    onClick={() => navigate(`/read/${id}`)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition duration-300"
                  >
                    Read Story
                  </button>
                  {user && story.author._id !== currentUserId && (
                  <button
                    onClick={handleLike}
                    className={`ml-4 px-4 py-2 rounded-full transition duration-300 ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}`}
                  >
                    <HeartIcon className="h-5 w-5 inline" />
                    {isLiked ? 'Unlike' : 'Like'}
                  </button>
                  )}
                   {user && story.author._id !== currentUserId && (
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="ml-4 px-4 py-2 transition duration-300"
                  >
                    <FlagIcon className="h-5 w-5 inline" />
                    Report
                  </button>
                  )}
                  <ReportModal 
                    isOpen={isReportModalOpen} 
                    onRequestClose={() => setIsReportModalOpen(false)} 
                    onReport={handleReport} 
                  />
                </div>
                <p className='py-2'>Likes: {story.likes.length}</p>
                <div className="mt-4">
                  <p className="text-lg font-semibold"> Rating: {story.reviews.length > 0 ? averageRating : 'N/A'} 
                  </p>
                </div>
                <h3 className="mt-6 text-lg font-bold">Reviews</h3>        
                <ReviewList reviews={story.reviews} />
                
                {story.reviews.some((review) => review.userId._id === currentUserId) ? (
                  <div>
                    <div>
                      <button
                        onClick={() => {
                          const reviewToEdit = story.reviews.find((review) => review.userId._id === currentUserId);
                          if (reviewToEdit) {
                            handleEditClick(reviewToEdit);
                          }
                        }}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                        aria-label="Edit Review"
                      >
                        <EditIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          const reviewToDelete = story.reviews.find((review) => review.userId._id === currentUserId);
                          if (reviewToDelete) {
                            handleDeleteClick(reviewToDelete._id);
                          }
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                        aria-label="Delete Review"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    {isEditing && (
                      <ReviewForm
                        onSubmit={handleEditSubmit}
                        userRating={userRating}
                        setUserRating={setUserRating}
                        userReview={userReview}
                        setUserReview={setUserReview}
                        isEditing={true}
                      />
                    )}
                  </div>
                ) : (
                  user && story.author._id !== currentUserId && (
                    <ReviewForm
                      onSubmit={handleReviewSubmit}
                      userRating={userRating}
                      setUserRating={setUserRating}
                      userReview={userReview}
                      setUserReview={setUserReview}
                      isEditing={false}
                    />
                  )
                )}
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