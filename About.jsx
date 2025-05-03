import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from './assets/pagelogo.png';
import Lexi from './assets/lexi.jpg';
import Krisha from './assets/krisha.jpg';
import Shen from './assets/shen.png';
import Gerald from './assets/gerald.jpg';


const About = () => {
     const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      {/* Header - Similar to the one in Home component */}
      <header className="bg-white text-gray-800 py-4 px-6 shadow-sm w-full">
        <div className="container mx-auto w-full">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={Logo}
                alt="JobSyncra Logo"
                className="w-100 h-20" 
              />
            </div>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-800 hover:text-blue-500">Home</Link>
              <Link to="/jobs" className="text-gray-800 hover:text-blue-500">Jobs</Link>
              <Link to="/resources" className="text-gray-800 hover:text-blue-500">Resources</Link>
              <Link to="/about" className="text-gray-800 hover:text-blue-500 font-semibold">About</Link>
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
          </div>
        </div>
      </header>

      {/* Page Title Banner */}
      <div className="bg-blue-500 py-12 w-full">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">About JobSyncra</h1>
          <p className="text-white text-lg mt-4 max-w-2xl mx-auto">
            Revolutionizing career development with AI-powered job matching
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-blue-500">Our Mission</h2>
            <p className="text-gray-700 mb-6 text-lg">
              At JobSyncra, we're on a mission to transform how people find and secure their dream jobs. By harnessing the power of artificial intelligence, we create personalized job matching experiences that connect talented individuals with opportunities that truly align with their skills, experiences, and career aspirations.
            </p>
            <p className="text-gray-700 text-lg">
              We believe that everyone deserves a fulfilling career path, and our AI-powered platform is designed to eliminate the frustration and uncertainty from job searching, making it more efficient and effective for job seekers everywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Team Section */}
      <div className="py-16 px-4 bg-gray-100 w-full">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-500">Meet the Developers</h2>
          
          {/* Team members grid - 2 columns on medium screens, 1 on small */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col">
                <div className="bg-blue-500 p-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                    <img
                      src={Lexi}
                      alt="Lexi"
                      className="h-32 w-32 object-cover rounded-full"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Lexi Jade S. Perdigon</h3>
                  <p className="text-blue-500 font-semibold mb-4">Lead Backend Developer</p>
                  
                  <p className="text-gray-700 mb-4">
                    An innovative full-stack developer passionate about creating technology solutions that make a real difference in people's lives.
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Technical Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "JavaScript", "Firebase", "Tailwind CSS", "Node.js"].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect:</h4>
                    <div className="flex space-x-4">
                      <a href="https://github.com/lexiperdigon" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://www.facebook.com/Iexiperdigon" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.494v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.92.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                        </svg>
                      </a>
                      <a href="mailto:lexi@example.com" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col">
                <div className="bg-blue-500 p-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                    <img
                      src={Krisha}
                      alt="Krisha"
                      className="h-32 w-32 object-cover rounded-full"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Krisha Gyle C. Sapitanan</h3>
                  <p className="text-blue-500 font-semibold mb-4">Lead Backend Developer</p>
                  
                  <p className="text-gray-700 mb-4">
                    An innovative full-stack developer passionate about creating technology solutions that make a real difference in people's lives.
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Technical Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "JavaScript", "Firebase", "Tailwind CSS", "Node.js"].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect:</h4>
                    <div className="flex space-x-4">
                      <a href="https://github.com/krishagyle" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://www.facebook.com/krishagyle#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.494v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.92.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                        </svg>
                      </a>
                      <a href="mailto:krisha@example.com" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col">
                <div className="bg-blue-500 p-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                    <img
                      src={Shen}
                      alt="Shenilyn"
                      className="h-32 w-32 object-cover rounded-full"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Shenilyn R. Flores</h3>
                  <p className="text-blue-500 font-semibold mb-4">Frontend Developer</p>
                  
                  <p className="text-gray-700 mb-4">
                    An innovative developer passionate about creating user-friendly interfaces and seamless user experiences.
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Technical Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "JavaScript", "Tailwind CSS", "UI/UX Design", "HTML/CSS"].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect:</h4>
                    <div className="flex space-x-4">
                      <a href="https://github.com/Shenilyn" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://www.facebook.com/profile.php?id=100009396868047#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.494v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.92.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                        </svg>
                      </a>
                      <a href="mailto:shen@example.com" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col">
                <div className="bg-blue-500 p-6 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-inner">
                    <img
                      src={Gerald} 
                      alt="Gerald"
                      className="h-32 w-32 object-cover rounded-full"
                    />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Gerald C. Cabela</h3>
                  <p className="text-blue-500 font-semibold mb-4">Technical Writer</p>
                  
                  <p className="text-gray-700 mb-4">
                    An innovative developer specializing in creating responsive and intuitive user interfaces with modern web technologies.
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Technical Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {["React", "JavaScript", "Tailwind CSS", "UI/UX Design", "HTML/CSS"].map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Connect:</h4>
                    <div className="flex space-x-4">
                      <a href="https://github.com/GeraldCabela" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="https://www.facebook.com/gerald.cabela.7" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.494v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.92.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                        </svg>
                      </a>
                      <a href="mailto:gerald@example.com" className="text-gray-700 hover:text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Our Technology Section */}
      <div className="py-16 px-4 bg-white w-full">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-500">Our Technology</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-blue-500">AI-Powered Matching</h3>
              <p className="text-gray-700 text-center">
                Our sophisticated algorithms analyze skills, experience, and career goals to find the perfect job matches.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-blue-500">Firebase Security</h3>
              <p className="text-gray-700 text-center">
                Built with Firebase for secure authentication and real-time database functionality.
              </p>
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-blue-500">Responsive Design</h3>
              <p className="text-gray-700 text-center">
                Built with React and Tailwind CSS for a seamless experience across all devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      

      {/* Our Vision */}
      <div className="py-16 px-4 bg-blue-500 text-white w-full">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            "To create a world where everyone can find meaningful work that aligns with their passions, skills, and life goals through intelligent technology that understands human potential."
          </p>
          <Link to="/signup" className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
            Join Our Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 w-full">
        <div className="container mx-auto px-4">
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
              <p className="text-gray-400 mt-4">
                Using artificial intelligence to connect talent with opportunity.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="mailto:contact@jobsyncra.com" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 13.065L0 6.75V18c0 1.1.9 2 2 2h20a2 2 0 0 0 2-2V6.75l-12 6.315zM22 4H2C.9 4 0 4.9 0 6v.24l12 6.32 12-6.32V6c0-1.1-.9-2-2-2z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/jobsyncra/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Career Resources</Link></li>
                <li><Link to="/assessment" className="text-gray-400 hover:text-white">Career Assessment</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">About Us</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About JobSyncra</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 JobSyncra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;