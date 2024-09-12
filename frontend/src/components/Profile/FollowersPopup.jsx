import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config';
import { useSelector } from 'react-redux';
import axios from 'axios';

const FollowersPopup = ({ followers, following, onClose }) => {
  const [followerDetails, setFollowerDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const { user } = useSelector((state) => state.auth);
   
  console.log(followers)
  console.log(following)
  const userData = user?.user || user;
  const currentUserId = userData.id || userData._id;

  const fetchUserDetails = async (userIds) => {
    try {
      const responses = await Promise.all(
        userIds.map(userId => {
          const url = `${API_URL}/users/${userId}`;
          console.log('Fetching:', url);
          return fetch(url);
        })
      );
      const users = await Promise.all(responses.map(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      }));
      return users;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return [];
    }
  };

  const handleUnfollow = async (userId) => {
    try {
        await axios.post(`${API_URL}/users/${currentUserId}/unfollow/${userId}`);
        
        // Update following details by filtering out the unfollowed user
        setFollowingDetails(prevFollowing => 
            prevFollowing.filter(user => user._id !== userId)
        );

        // Optionally, refetch followerDetails to ensure it's up to date
        const newFollowerDetails = await fetchUserDetails(followers.map(follower => follower.userId));
        setFollowerDetails(newFollowerDetails);

        console.log(`Unfollowed user: ${userId}`);
    } catch (err) {
        console.error("Error unfollowing user:", err);
    }
};


  useEffect(() => {
    const getFollowerDetails = async () => {
      const userIds = followers.map(follower => follower.userId);
      const details = await fetchUserDetails(userIds);
      setFollowerDetails(details);
    };

    const getFollowingDetails = async () => {
      const userIds = following.map(user => user.userId);
      const details = await fetchUserDetails(userIds);
      setFollowingDetails(details);
    };

    getFollowerDetails();
    getFollowingDetails();
  }, [followers, following]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">Followers ({followerDetails.length})</h2>
        {followerDetails.length > 0 ? (
          <ul className="mb-4">
            {followerDetails.map(follower => (
              <li key={follower._id} className="border-b py-2">
                {follower.username}
              </li>
            ))}
          </ul>
        ) : (
          <p>No followers yet.</p>
        )}

        <h2 className="text-xl font-bold mt-4 mb-4">Following ({followingDetails.length})</h2>
        {followingDetails.length > 0 ? (
          <ul>
            {followingDetails.map(user => (
              <li key={user._id} className="border-b py-2 flex justify-between items-center">
                {user.username}
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleUnfollow(user._id)} // Pass userId to handleUnfollow
                >
                  Unfollow
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Not following anyone yet.</p>
        )}

        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowersPopup;
