import React from 'react';

const CurrentJobMatch = ({ currentJob }) => {
  const { title, overallMatch, skills } = currentJob;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Current Job Match</h3>
      <div className="flex items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#edf2f7" 
              strokeWidth="10" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#3182ce" 
              strokeWidth="10" 
              strokeDasharray={`${overallMatch * 2.83} 283`} 
              strokeDashoffset="0" 
              transform="rotate(-90 50 50)" 
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{overallMatch}%</span>
            <span className="text-xs text-gray-500">Match</span>
          </div>
        </div>
        <div className="ml-6">
          <h4 className="font-medium text-lg">{title}</h4>
          <p className="text-gray-600 text-sm">Based on your resume</p>
        </div>
      </div>
      <div>
        <h4 className="font-medium mb-2">Skills Analysis</h4>
        {skills.map((skill) => (
          <div key={skill.name} className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm">{skill.name}</span>
              <span className="text-sm text-gray-600">{skill.match}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${skill.match}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentJobMatch;