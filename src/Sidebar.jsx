import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items configuration
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Resume', path: '/resume' },
    { name: 'Job Matches', path: '/job-matches' },
    { name: 'Learning Path', path: '/learning-path' },
    { name: 'Settings', path: '/settings' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 bg-blue-600">
        <Link to="/">
          <h1 className="text-xl font-bold text-white font-[Poppins]">Job Recos</h1>
        </Link>
      </div>
      <div className="py-4">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`block px-6 py-3 transition-all duration-200 ease-in-out
              ${currentPath === item.path 
                ? 'bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500' 
                : 'hover:bg-blue-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-500'
              } cursor-pointer`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;