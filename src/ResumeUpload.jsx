import React from 'react';

const ResumeUpload = ({ onResumeUpload }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Upload Your Resume</h3>
      <p className="text-gray-600 mb-6">
        Upload your resume to get personalized job matches and skill recommendations.
      </p>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              onResumeUpload(e.target.files[0]);
            }
          }}
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <span className="mt-2 text-gray-600">Click to upload or drag and drop</span>
          <span className="mt-1 text-gray-500 text-sm">PDF, DOC, DOCX files supported</span>
        </label>
      </div>
    </div>
  );
};

export default ResumeUpload;