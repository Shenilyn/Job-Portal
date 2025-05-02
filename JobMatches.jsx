import React from 'react';
import Sidebar from './Sidebar';

const JobMatches = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Job Matches</h1>
        {/* Add job matches content here */}
        <p>Discover personalized job recommendations</p>
      </div>
    </div>
  );
};

export default JobMatches;