import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Navigation items configuration with icons
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Learning Path', 
      path: '/learning-path',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    { 
      name: 'Model Predictions', 
      path: '/ML_prediction',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    // Show confirmation prompt
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Add your logout logic here, such as:
      // - Clear local storage/cookies
      // - Call logout API
      // - Reset user state
      
      // Navigate to login page after logout
      navigate('/login');
    }
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
              className={`flex items-center px-6 py-3 transition-all duration-200 ease-in-out
                ${currentPath === item.path 
                  ? 'bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500' 
                  : 'hover:bg-blue-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-500'
                } cursor-pointer`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
        
        {/* Logout button positioned at the absolute bottom of sidebar */}
        <div className="mt-auto flex flex-col gap-2">
          {/* JobSyncra AI Button */}
          <button
            className={`w-full flex items-center px-6 py-3 transition-all duration-200 ease-in-out text-left ${
              currentPath === "/job-syncra-ai"
                ? "bg-blue-100 text-blue-800 font-semibold border-l-4 border-blue-500"
                : "hover:bg-blue-50 hover:text-blue-600 hover:border-l-4 hover:border-blue-500"
            } cursor-pointer`}
            onClick={() => window.open("http://localhost:5173/", "_blank")}
          >
            <img src="/JSai.png" alt="JobSyncra Logo" className="h-8 w-8 mr-2" />
            <span className="text-sm font-medium">Go to JobSyncra AI</span>
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full px-6 py-4 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium flex items-center bg-white border-t border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
      
      {/* Main content area with left margin to prevent sidebar overlap */}
      <div className="ml-64">
        {/* Your page content goes here */}
      </div>
    </>
  );
};

export default Sidebar;