import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUnpublishedStories } from '../features/story/storyAction';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unpublished: unpublishedStories, loading, error } = useSelector((state) => state.stories);

  const userId = user?._id || user?.user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchUnpublishedStories(userId));
    }
  }, [userId, dispatch]);

  const handleStartWriting = () => {
    if (!user) {
      navigate('/login');
    } else if (unpublishedStories.length > 0) {
      navigate('/unpublished-stories');
    } else {
      navigate('/writing');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen lg:h-[645px]">
      {/* Left side */}
      <div className="lg:w-1/2 bg-black flex flex-col justify-center px-8 py-8 lg:py-0 lg:px-16 h-1/2 lg:h-[645px]">
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
          Unleash Your Creativity
        </h1>
        <p className="text-gray-400 mb-8">
          Join our novel writing community.
        </p>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <button
            onClick={handleStartWriting}
            className="bg-purple-600 text-white py-3 px-6 rounded-md w-full lg:w-auto hover:bg-purple-800 transition duration-300"
          >
            Start Writing Now
          </button>
          <button className="bg-purple-200 text-black py-3 px-6 rounded-md w-full lg:w-auto hover:bg-purple-500 transition duration-300">
            <Link to="/ai" className="block w-full h-full">
              AI Story Experience
            </Link>
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="lg:w-1/2 bg-sky-100 h-1/2 lg:h-[645px]">
        <img
          src="/Image  --lummi.jpg"
          alt="Fantasy Landscape"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Header;
