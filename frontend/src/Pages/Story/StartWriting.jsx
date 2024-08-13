import React, { useEffect, useState } from 'react';
import StoryBoard from '../../components/Story/StoryBoard';
import Navbar from '../../components/Story/NavBar';

const StartWriting = () => {
  const [storyId, setStoryId] = useState(null);

  useEffect(() => {
    const storedStory = localStorage.getItem('selectedStory');
    if (storedStory) {
      const parsedStory = JSON.parse(storedStory);
      setStoryId(parsedStory._id);
    }
  }, []);

  return (
    <>
      <Navbar />
      {storyId ? <StoryBoard storyId={storyId} /> : <p>Loading...</p>}
    </>
  );
}

export default StartWriting;
