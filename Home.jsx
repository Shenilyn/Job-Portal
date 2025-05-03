import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';
import Logo from './assets/pagelogo.png';


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

  // Handler for "Get Started Now" button
  const handleGetStarted = () => {
    console.log("Navigating to sign up page from CTA");
    navigate("/signup");
  };

  const MyComponent = () => {
    return <img src={Logo} alt="Logo" />;
  };
  

  return (
    <div className="flex flex-col min-h-screen w-full">
    
      <header className="bg-white text-gray-800 py-4 px-6 shadow-sm w-full">
        <div className="container mx-auto w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
              src={Logo}
              alt="Logo"
              className="w-100 h-20" 
              />
            </div>
            
          
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-800 hover:text-blue-500">Home</Link>
              <Link to="/jobs" className="text-gray-800 hover:text-blue-500">Jobs</Link>
              <Link to="/resources" className="text-gray-800 hover:text-blue-500">Resources</Link>
              <Link to="/about" className="text-gray-800 hover:text-blue-500">About</Link>
            </nav>
            
            
        
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
                className="bg-white text-blue-500 px-5 py-2 rounded-full font-semibold border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section - Simplified as shown in the screenshot */}
      <div className="relative flex flex-col justify-center items-center bg-blue-500 text-white py-16 px-4 w-full overflow-hidden">
        <div className="bubbles-container"> 
          {[...Array(20)].map((_, i) => <div key={i} className="bubble"></div>)}
        </div>
        <div className="container mx-auto w-full">
          <div className="md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered Job Matching
            </h1>
            <p className="text-lg mb-8 max-w-lg">
              Find your perfect career match with our intelligent job recommendation system that understands your skills, experience, and career goals.
            </p>
          </div>
        </div>
      </div>

 
      <div className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-500">
            Why Choose Our Platform
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our AI-powered platform offers unique advantages to help you find the perfect job match faster and more accurately.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
            <div className="bg-gray-100 p-8 rounded-lg text-center transition transform hover:scale-105 hover:shadow-lg">
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
            
      
            <div className="bg-gray-100 p-8 rounded-lg text-center transition transform hover:scale-105 hover:shadow-lg">
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
            
            
            <div className="bg-gray-100 p-8 rounded-lg text-center transition transform hover:scale-105 hover:shadow-lg">
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
      
  
      <div className="py-16 px-4 bg-gray-100 w-full">
        <div className="container mx-auto w-full">
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-500">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Finding your dream job is easy with our simple 4-step process.
          </p>
          
          <div className="flex flex-col md:flex-row justify-between items-start max-w-4xl mx-auto relative">
    
            <div className="hidden md:block absolute top-10 left-18 right-18 h-1 bg-blue-200"></div>
            
         
            <div className="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 relative">
              <div className="bg-blue-500 h-20 w-20 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl z-10">
                1
              </div>
              <div className="h-12 w-1 bg-blue-200 md:hidden"></div>
              <h3 className="text-xl font-semibold mt-2 text-blue-500 text-center">Create Profile</h3>
              <p className="text-gray-600 text-center mt-2">
                Sign up and create your comprehensive professional profile.
              </p>
            </div>
            
       
            <div className="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 relative">
              <div className="bg-blue-500 h-20 w-20 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl z-10">
                2
              </div>
              <div className="h-12 w-1 bg-blue-200 md:hidden"></div>
              <h3 className="text-xl font-semibold mt-2 text-blue-500 text-center">Upload Resume</h3>
              <p className="text-gray-600 text-center mt-2">
                Upload your resume for AI analysis and optimization.
              </p>
            </div>
         
            <div className="flex flex-col items-center mb-8 md:mb-0 w-full md:w-1/4 relative">
              <div className="bg-blue-500 h-20 w-20 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl z-10">
                3
              </div>
              <div className="h-12 w-13 bg-blue-200 md:hidden"></div>
              <h3 className="text-xl font-semibold mt-2 text-blue-500 text-center">Get Matches</h3>
              <p className="text-gray-600 text-center mt-2">
                Receive personalized job recommendations based on your profile.
              </p>
            </div>
            
        
            <div className="flex flex-col items-center w-full md:w-1/4 relative">
              <div className="bg-blue-500 h-20 w-20 rounded-full flex items-center justify-center mb-4 text-white font-bold text-2xl z-10">
                4
              </div>
              <h3 className="text-xl font-semibold mt-2 text-blue-500 text-center">Apply & Track</h3>
              <p className="text-gray-600 text-center mt-2">
                Apply to jobs and track your application status.
              </p>
            </div>
          </div>
        </div>
      </div>
      
  
      <div className="py-16 px-4 bg-blue-500 text-white w-full">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who found their perfect career match with our AI-powered platform.
          </p>
          <button 
            onClick={handleGetStarted} 
            className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Get Started Now 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
      
   
      <footer className="bg-gray-800 text-white py-12 w-full">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
   
            <div>
            <div className="flex items-center">
              <img
                src="/preview.png"
                alt="JobSyncra"
                className="h-8 w-8 rounded-md object-cover mr-2"
              />
              <span className="font-bold text-xl">JobSyncra</span>
            </div>

              <p className="text-gray-400 mb-4">
                Using artificial intelligence to connect talent with opportunity.
              </p>
              <div className="flex space-x-4">
                
               
              <a
                href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 13.065L0 6.75V18c0 1.1.9 2 2 2h20a2 2 0 0 0 2-2V6.75l-12 6.315zM22 4H2C.9 4 0 4.9 0 6v.24l12 6.32 12-6.32V6c0-1.1-.9-2-2-2z" />
                </svg>
              </a>

                <a
                  href="https://www.instagram.com/jobsyncra/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
         
            <div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Browse Jobs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Career Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Career Assessment</a></li>
              </ul>
            </div>
            
      
            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <ul className="space-y-2">
              
              <p className="text-gray-700 mt-4">
               <Link to="/contact" className="text-blue-500 hover:underline">Contact Us</Link>
              </p>
                <p className="text-gray-700 mt-4">
               <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
              </p>

              <p className="text-gray-700 mt-4">
               <Link to="/terms" className="text-blue-500 hover:underline">Terms & Conditions</Link>
              </p>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 AI Job Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;