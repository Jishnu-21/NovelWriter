import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { FaUserCircle, FaEdit, FaCamera, FaBookOpen, FaTags } from 'react-icons/fa';
import GenreModal from './GenreModal';
import RecommendedStories from './RecommendedStories';
import axios from 'axios';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userDetails, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [interests, setInterests] = useState('');

  const userData = user?.user || {};
  const userId = userData.id || user._id;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
        setUsername(data.username);
        setInterests(data.interests ? data.interests.join(', ') : '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserStories = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/story/by-author/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserStories(data);
      } catch (error) {
        console.error('Error fetching user stories:', error);
        setError('Error fetching user stories');
      }
    };

    if (userId) {
      fetchUserData();
      fetchUserStories();
    }
  }, [userId]);

  const handleEditProfile = async () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('file', imageFile);

    try {
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating profile');
    }
  };

  const handleFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleInterestsChange = (event) => {
    setInterests(event.target.value);
  };

  const handleAddInterests = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${userId}`, {
        interests: interests.split(',').map(interest => interest.trim())
      });

      setUser(response.data.user);
      alert('Interests updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating interests:', error);
      alert('Error updating interests');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUsername(userDetails.username);
    setImageFile(null);
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-white rounded-lg shadow-lg m-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <div className="flex items-center space-x-4">
            <button
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <FaTags className="mr-2" /> Add Interests
            </button>
            {!isEditing && (
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition flex items-center"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </header>
        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/3">
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 group">
              {userDetails?.image_url ? (
                <img
                  src={userDetails.image_url}
                  alt="Profile"
                  className="w-full h-full object-contain rounded bg-gray-100"
                />
              ) : (
                <div className="w-full h-64 flex items-center justify-center bg-gray-200">
                  <FaUserCircle className="w-32 h-32 text-gray-500" />
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label htmlFor="profile-image" className="cursor-pointer flex flex-col items-center">
                    <FaCamera className="text-white text-4xl" />
                    <span className="text-white mt-2">Change Image</span>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-gray-700">Update Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Enter new username"
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
                    onClick={handleEditProfile}
                  >
                    Save Changes
                  </button>
                  <button
                    className="w-full bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-2">
                <h2 className="text-xl font-semibold">Name: {userDetails?.username}</h2>
                <p className="text-gray-700">Email: {userDetails?.email}</p>
                <p className="text-gray-700">
                  Interests: {userDetails?.interests?.join(', ') || 'None'}
                </p>
              </div>
            )}
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaBookOpen className="mr-2" /> Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userStories.length > 0 ? (
                userStories.map((story) => (
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
        
        {/* Add the RecommendedStories component */}
        <RecommendedStories userId={userId} />
      </main>
      <GenreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        interests={interests}
        onChange={handleInterestsChange}
        onSave={handleAddInterests}
      />
    </div>
  );
};

export default UserProfile;