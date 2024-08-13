import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
import { addInterest } from '../../features/user/userActions'; // Import the action

const GenreModal = ({ isOpen, onClose, onInterestsUpdated }) => {
  const { user } = useSelector((state) => state.auth);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const dispatch = useDispatch();
  const userData = user?.user || {};
  const userId = userData.id || user._id;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/story/genres'); // Replace with your genres API endpoint
        setAllGenres(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreChange = (genre) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre)
        ? prevSelected.filter((g) => g !== genre)
        : [...prevSelected, genre]
    );
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/interests`, {
        interests: selectedGenres
      });
      dispatch(addInterest(user._id, selectedGenres)); 
      if (onInterestsUpdated) {
        onInterestsUpdated(selectedGenres); // Notify parent component of the update
      }
      onClose();
    } catch (error) {
      console.error('Error saving interests:', error);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Your Interests</h2>
          <button onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {allGenres.map((genre) => (
            <button
              key={genre._id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedGenres.includes(genre.name) ? 'bg-black text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleGenreChange(genre.name)}
            >
              {genre.name}
            </button>
          ))}
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  ) : null;
};

export default GenreModal;
