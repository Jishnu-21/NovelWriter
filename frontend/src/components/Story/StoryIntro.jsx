import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createStory, fetchGenres } from '../../features/story/storyAction';
import { setSelectedStory } from '../../features/story/storySlice';

const StoryInfoForm = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('PG13');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { genres, loading, error } = useSelector((state) => state.stories);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('coverPage', file);
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('rating', rating);
    formData.append('name', name);
    const userId = user._id || user.user?.id;
    formData.append('id', userId);

    try {
      const resultAction = await dispatch(createStory(formData));
      if (createStory.fulfilled.match(resultAction)) {
        const newStory = resultAction.payload;
        dispatch(setSelectedStory(newStory));
        navigate(`/story-writing/${newStory._id}`);
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      console.error('Failed to create story:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h1 className="text-2xl font-bold mb-4">Story Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
            {error}
          </div>
        )}
        {loading && (
          <div className="text-blue-600 bg-blue-100 p-4 rounded-md mb-4">
            Loading...
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Cover Page</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Select Genre</option>
            {Array.isArray(genres) && genres.length > 0 ? (
              genres.map((g) => (
                <option key={g._id} value={g.name}>{g.name}</option>
              ))
            ) : (
              <option disabled>No genres available</option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="Adult">Adult</option>
            <option value="PG13">PG13</option>
            <option value="Teen">Teen</option>
            <option value="E">Everyone</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md shadow-sm hover:bg-blue-700"
        >
          Start Writing
        </button>
      </form>
    </div>
  );
};

export default StoryInfoForm;
