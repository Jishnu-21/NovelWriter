import React from 'react';
import NavBar from '../NavBar';
import Sidebar from './Sidebar';
import ReadingHistory from '../History/ReadingHistory';

const History = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ">
          <div className="max-w-2xl mx-auto">
            <ReadingHistory />
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;
