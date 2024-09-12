import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { useSelector } from 'react-redux';
import { API_URL } from './config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ChatPopup from './components/Profile/ChatPopup';
import { io } from 'socket.io-client';
import { subscribeToUserChannel } from './app/pusher';

const AuthorProfile = () => {
  const { userId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [authorStories, setAuthorStories] = useState([]);
  const { user } = useSelector((state) => state.auth);
  
  const userData = user?.user || user;
  const currentUserId = userData.id || user?._id;
  const [chatOpen, setChatOpen] = useState(false);
  const socket = useRef(null);

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setAuthor(response.data);
        setIsFollowing(response.data.followers.some(follower => follower.userId === currentUserId));
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchAuthorStories = async () => {
      try {
        const response = await axios.get(`${API_URL}/story/by-author/${userId}`);
        setAuthorStories(response.data);
      } catch (err) {
        console.error('Error fetching author stories:', err);
      }
    };

    if (userId) {
      fetchAuthorProfile();
      fetchAuthorStories();
      

      // Subscribe to Pusher channel for the user
      const unsubscribe = subscribeToUserChannel(userId);

      // Cleanup function
      return () => {
        unsubscribe();
      };  
    }
  }, [userId, currentUserId]);


  const handleFollow = async () => {
    try {
      await axios.post(`${API_URL}/users/${currentUserId}/follow/${userId}`);
      setIsFollowing(true);
      setAuthor(prevAuthor => ({
        ...prevAuthor,
        followers: [...prevAuthor.followers, { userId: currentUserId }],
      }));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(`${API_URL}/users/${currentUserId}/unfollow/${userId}`);
      setIsFollowing(false);
      setAuthor(prevAuthor => ({
        ...prevAuthor,
        followers: prevAuthor.followers.filter(follower => follower.userId !== currentUserId),
      }));
      setChatOpen(false);
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto p-4 md:p-8 lg:p-11 flex-grow">
        {author && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 md:p-6 flex flex-col items-center">
              {author.image_url ? (
                <img 
                  src={author.image_url} 
                  alt={author.username} 
                  className="w-32 h-32 object-cover rounded-full mb-4"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-300 rounded-full mb-4">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600 text-4xl" />
                </div>
              )}
              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">{author.username}</h1>
              <p className="text-gray-700 text-base mb-4"><strong>Email:</strong> {author.email}</p>
              <p className="text-gray-700 text-base mb-4"><strong>Followers:</strong> {author.followers.length}</p>
              <p className="text-gray-700 text-base mb-4"><strong>Following:</strong> {author.following.length}</p>
              {isFollowing ? (
                <>
                  <button 
                    onClick={handleUnfollow} 
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                  >
                    Unfollow
                  </button>
                  <button 
                    onClick={() => setChatOpen(true)} 
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out mt-2"
                  >
                    Chat
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleFollow} 
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out"
                >
                  Follow
                </button>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Stories by {author.username}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {authorStories.length > 0 ? (
                  authorStories.map(story => (
                    <div key={story._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                      <img
                        src={story.coverPage || 'default-cover.jpg'}
                        alt={story.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <p className="font-semibold text-lg">{story.name}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No stories available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />

      {chatOpen && isFollowing && (
        <ChatPopup
          className="py-8"
          socket={socket.current}
          user={author} 
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default AuthorProfile;
