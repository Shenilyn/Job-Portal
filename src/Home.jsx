import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';

function Home() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  
  // Handle viewport height for mobile browsers
  useEffect(() => {
    // Function to set the viewport height variable
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Set the height initially
    setVH();
    
    // Add event listener for resize
    window.addEventListener('resize', setVH);
    
    // Clean up
    return () => window.removeEventListener('resize', setVH);
  }, []);

  // Handler for login button
  const handleLogin = () => {
    console.log("Navigating to login page");
    navigate("/login");
  };

  // Handler for sign up button
  const handleSignUp = () => {
    console.log("Navigating to sign up page");
    navigate("/signup");
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header with logo and navigation */}
      <header className="bg-white text-gray-800 py-4 px-6 shadow-sm w-full">
        <div className="container mx-auto w-full">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="bg-blue-500 rounded-md h-8 w-8 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl text-blue-500">AI Job Portal</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-800 hover:text-blue-500">Home</Link>
              <Link to="/jobs" className="text-gray-800 hover:text-blue-500">Jobs</Link>
              <Link to="/resources" className="text-gray-800 hover:text-blue-500">Resources</Link>
              <Link to="/about" className="text-gray-800 hover:text-blue-500">About</Link>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center border rounded-lg overflow-hidden bg-gray-100 px-2">
              <svg className="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search jobs..." 
                className="py-1 px-2 bg-transparent focus:outline-none text-sm w-48"
              />
            </div>
            
            {/* Sign Up and Login Buttons */}
            <div className="flex space-x-2">
              <button 
                onClick={handleSignUp}
                className="bg-blue-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </button>
              <button 
                onClick={handleLogin}
                className="bg-white text-blue-500 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative flex flex-col justify-center items-center bg-blue-500 text-white py-16 px-4 w-full overflow-hidden">
        <div className="bubbles-container"> 
          {[...Array(20)].map((_, i) => <div key={i} className="bubble"></div>)}
        </div>
        <div className="container mx-auto w-full flex flex-col md:flex-row items-center">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Job Matching
            </h1>
            <p className="text-lg mb-8 max-w-lg">
              Find your perfect career match with our intelligent job recommendation system that understands your skills, experience, and career goals.
            </p>
             {/*
            {<div className="flex space-x-4">
              <button className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center">
                Upload Resume
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
              <button className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Jobs
              </button>
            </div>}
          </div>
          <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center"> */}
            {/* Hero image placeholder if needed */}
          </div> 
        </div>
      </div>

      {/* Why Choose Our Platform section */}
      <div className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-500">
            Why Choose Our Platform
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our AI-powered platform offers unique advantages to help you find the perfect job match faster and more accurately.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Career Profile Analytics */}
            <div className="bg-gray-50 p-8 rounded-lg text-center transition transform hover:scale-105 hover:shadow-lg">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-500">Career Profile Analytics</h3>
              <p className="text-gray-600">
                Our AI conducts a deep analysis of your career profile and trajectory to provide valuable insights and personalized career recommendations.
              </p>
            </div>
            
            {/* Skills Assessment */}
            <div className="bg-gray-50 p-8 rounded-lg text-center transition transform hover:scale-105 hover:shadow-lg">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-500">Skills Assessment</h3>
              <p className="text-gray-600">
                Get instant AI-driven skill assessments and personalized feedback to help you stand out in your career.
              </p>
            </div>
            
            {/* Learning Path Recommendations */}
            <div className="bg-gray-50 p-8 rounded-lg text-center transition transform hover:scale-105 hover:shadow-lg">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-blue-500">Learning Path Recommendations</h3>
              <p className="text-gray-600">
                Discover personalized learning paths with AI-driven skill development recommendations to boost your career growth.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-100 text-gray-600 text-center py-4 text-sm mt-auto w-full">
        <div className="container mx-auto">
          © 2025 AI Job Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;