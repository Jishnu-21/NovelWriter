import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { publishStory } from '../../features/story/storyAction';

const Navbar = () => {
  const story = useSelector((state) => state.stories.selectedStory);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handlePublish = () => {
    if (story) {
      dispatch(publishStory(story._id)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          navigate('/gallery'); 
        }
      });
    }
  };

  return (
    <nav
      className="text-black shadow-md p-4 flex justify-between items-center"
    >
      <h1 className="text-xl font-bold">{story?.name} / {story?.genre}</h1>
      <button
        onClick={handlePublish}
        className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Publish
      </button>
    </nav>
  );
};

export default Navbar;
