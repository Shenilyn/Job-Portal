import React from 'react';

const RecommendedCourses = ({ courses }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
      <h3 className="text-lg font-semibold mb-4">Recommended Learning</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <div key={index} className="border rounded-lg p-4 hover:shadow-md transition">
            <h4 className="font-medium mb-2">{course.title}</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{course.duration}</span>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;