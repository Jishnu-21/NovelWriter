import React from 'react';
import { FaPenNib, FaCog, FaArrowUp, FaRobot, FaUserEdit, FaPeopleArrows } from 'react-icons/fa';

const InfoFP = ({ darkMode }) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} py-16`}>
      <div className="text-center">
        <h2 className="text-sm text-purple-600">Innovations</h2>
        <h1 className="text-5xl font-bold my-4">Creative Platform</h1>
        <p className="max-w-2xl mx-auto">
          Empower your writing with innovative tools and a supportive community. Discover new ideas and improve your storytelling.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 text-center justify-items-center">
        {/* Each feature box */}
        <div className="flex flex-col items-center">
          <FaPenNib className={`h-12 w-12 ${darkMode ? 'text-white' : 'text-black'} mb-4`} />
          <h3 className="text-xl font-semibold">Create Story</h3>
          <p className="text-gray-500 mt-2">Start writing your own interactive stories</p>
        </div>
        <div className="flex flex-col items-center">
          <FaCog className={`h-12 w-12 ${darkMode ? 'text-white' : 'text-black'} mb-4`} />
          <h3 className="text-xl font-semibold">Interactive Features</h3>
          <p className="text-gray-600 mt-2">Set up story branches, choices, and multiple endings</p>
        </div>
        <div className="flex flex-col items-center">
          <FaArrowUp className={`h-12 w-12 ${darkMode ? 'text-white' : 'text-black'} mb-4`} />
          <h3 className="text-xl font-semibold">Publishing Options</h3>
          <p className="text-gray-600 mt-2">Authors can publish their completed stories to the platform</p>
        </div>
        <div className="flex flex-col items-center">
          <FaRobot className={`h-12 w-12 ${darkMode ? 'text-white' : 'text-black'} mb-4`} />
          <h3 className="text-xl font-semibold">AI Support</h3>
          <p className="text-gray-600 mt-2">Use AI to summarize your stories and experience a flawless writing</p>
        </div>
        <div className="flex flex-col items-center">
          <FaUserEdit className={`h-12 w-12 ${darkMode ? 'text-white' : 'text-black'} mb-4`} />
          <h3 className="text-xl font-semibold">Custom Workspaces</h3>
          <p className="text-gray-600 mt-2">Personalize your writing environment to suit your style. Stay organized and focused.</p>
        </div>
        <div className="flex flex-col items-center">
          <FaPeopleArrows className={`h-12 w-12 ${darkMode ? 'text-white' : 'text-black'} mb-4`} />
          <h3 className="text-xl font-semibold">Community Support</h3>
          <p className="text-gray-600 mt-2">Join a community of writers who share your passion. Exchange ideas and find inspiration.</p>
        </div>
      </div>

      <div className="mt-16 py-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center pb-5">How It Works</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Create Your Story</h3>
            <p className="text-gray-600 mt-2">Start writing your story with our story writer.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Share with Others</h3>
            <p className="text-gray-600 mt-2">Publish your story for others to read and enjoy.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Get Feedback</h3>
            <p className="text-gray-600 mt-2">Receive constructive feedback from our community.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoFP;
