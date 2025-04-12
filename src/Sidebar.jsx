import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Navigation items configuration
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Learning Path', path: '/learning-path' },
    { name: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    // Add your logout logic here, such as:
    // - Clear local storage/cookies
    // - Call logout API
    // - Reset user state
    
    // Navigate to login page after logout
    navigate('/login');
  };

  return (
    <>
      {/* Fixed sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col z-10">
        <div className="p-6 bg-blue-600">
          <Link to="/">
            <h1 className="text-xl font-bold text-white font-[Poppins]">JobSyncra</h1>
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
        
        {/* Logout button positioned at the absolute bottom of sidebar */}
        <button 
          onClick={handleLogout}
          className="absolute bottom-0 left-0 w-full px-6 py-4 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium flex items-center bg-white border-t border-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
      
      {/* Main content area with left margin to prevent sidebar overlap */}
      <div className="ml-64">
        {/* Your page content goes here */}
      </div>
    </>
  );
};

export default Sidebar;