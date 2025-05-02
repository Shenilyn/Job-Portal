import React from 'react';
import Sidebar from './Sidebar';

const Resume = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">My Resume</h1>
        {/* Add resume content here */}
        <p>Manage and edit your professional resume</p>
      </div>
    </div>
  );
};

export default Resume;