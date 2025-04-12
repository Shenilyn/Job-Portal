import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Sidebar from './Sidebar';

const LearningPath = () => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [resumeVisible, setResumeVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("You must be logged in to view your learning path");
          setLoading(false);
          return;
        }

        // Fetch user recommendations and resume data from Firestore
        const userDocRef = doc(db, "resumeResults", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          if (userDoc.data().geminiRecommendations) {
            setRecommendations(userDoc.data().geminiRecommendations);
          } else {
            setError("No learning path found. Please upload your resume on the dashboard first.");
          }
          
          // Set resume data if available
          if (userDoc.data().resumeText || userDoc.data().parsedResume) {
            setResumeData({
              resumeText: userDoc.data().resumeText || '',
              parsedResume: userDoc.data().parsedResume || null,
              uploadDate: userDoc.data().uploadTimestamp ? new Date(userDoc.data().uploadTimestamp.toDate()).toLocaleString() : 'Unknown date'
            });
          }
        } else {
          setError("No learning path found. Please upload your resume on the dashboard first.");
        }
      } catch (err) {
        console.error("Error fetching learning path:", err);
        setError("Failed to load your learning path. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const toggleCourseExpand = (courseIndex) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseIndex]: !prev[courseIndex]
    }));
  };

  const toggleResumeVisibility = () => {
    setResumeVisible(!resumeVisible);
  };

  // Generate URL for a course (demo functionality)
  const generateCourseUrl = (course) => {
    const providers = {
      'Coursera': 'https://www.coursera.org/search?query=',
      'Udemy': 'https://www.udemy.com/courses/search/?q=',
      'LinkedIn Learning': 'https://www.linkedin.com/learning/search?keywords=',
      'edX': 'https://www.edx.org/search?q=',
      'Pluralsight': 'https://www.pluralsight.com/search?q=',
      'Codecademy': 'https://www.codecademy.com/search?query=',
      'DataCamp': 'https://www.datacamp.com/search?q=',
      'Khan Academy': 'https://www.khanacademy.org/search?referer=%2F&page_search_query=',
      'Udacity': 'https://www.udacity.com/courses/all?search=',
      'Google': 'https://www.google.com/search?q=',
      'Microsoft Learn': 'https://learn.microsoft.com/en-us/search/?terms=',
      'AWS Training': 'https://aws.amazon.com/training/learn-about/?search=',
      'FreeCodeCamp': 'https://www.freecodecamp.org/news/search/?query=',
      // Default for any other provider
      'default': 'https://www.google.com/search?q='
    };

    const provider = course.provider || "default";
    const baseUrl = providers[provider] || providers.default;
    const query = encodeURIComponent(course.title);
    return `${baseUrl}${query}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Format the resume for display
  const formatResumeSection = (section, items) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">{section}</h4>
        <ul className="list-disc list-inside space-y-1 pl-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-700">
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-grow p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Learning Path Available</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <a href="/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6">
        <div className="bg-white shadow-sm p-6 mb-6 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Your Personalized Learning Path</h1>
          <p className="text-gray-600 mt-2">
            Based on your resume analysis, we've created customized learning paths to help you advance your career.
          </p>
        </div>

        {/* Resume History Section */}
        {resumeData && (
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Resume History</h3>
                  <p className="text-sm text-gray-600">Uploaded on {resumeData.uploadDate}</p>
                </div>
              </div>
              <button 
                onClick={toggleResumeVisibility}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {resumeVisible ? 'Hide Resume' : 'View Resume'}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`ml-1 h-4 w-4 transition-transform ${resumeVisible ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {resumeVisible && (
              <div className="p-6 bg-gray-50 border-b">
                {resumeData.parsedResume ? (
                  <div className="space-y-4">
                    {/* Personal Info */}
                    {resumeData.parsedResume.personalInfo && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Personal Information</h3>
                        <p className="text-gray-700">
                          <strong>Name:</strong> {resumeData.parsedResume.personalInfo.name}<br />
                          {resumeData.parsedResume.personalInfo.email && (
                            <><strong>Email:</strong> {resumeData.parsedResume.personalInfo.email}<br /></>
                          )}
                          {resumeData.parsedResume.personalInfo.phone && (
                            <><strong>Phone:</strong> {resumeData.parsedResume.personalInfo.phone}<br /></>
                          )}
                          {resumeData.parsedResume.personalInfo.location && (
                            <><strong>Location:</strong> {resumeData.parsedResume.personalInfo.location}<br /></>
                          )}
                        </p>
                      </div>
                    )}
                    
                    {/* Skills */}
                    {formatResumeSection("Skills", resumeData.parsedResume.skills)}
                    
                    {resumeData.parsedResume.experience && resumeData.parsedResume.experience.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Work Experience</h3>
                        <div className="space-y-3">
                          {resumeData.parsedResume.experience.map((exp, idx) => (
                            <div key={idx} className="pl-2">
                              <p className="font-medium">{exp.title} at {exp.company}</p>
                              <p className="text-sm text-gray-600">{exp.date}</p>
                              <ul className="list-disc list-inside space-y-1 pl-2 mt-1">
                                {exp.description && exp.description.map((desc, i) => (
                                  <li key={i} className="text-gray-700 text-sm">{desc}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    
                    {resumeData.parsedResume.education && resumeData.parsedResume.education.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-800 mb-2">Education</h3>
                        <div className="space-y-3">
                          {resumeData.parsedResume.education.map((edu, idx) => (
                            <div key={idx} className="pl-2">
                              <p className="font-medium">{edu.degree}</p>
                              <p className="text-sm text-gray-600">{edu.institution}, {edu.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formatResumeSection("Projects", resumeData.parsedResume.projects)}
                    
                    {formatResumeSection("Certifications", resumeData.parsedResume.certifications)}
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-medium text-gray-800 mb-2">Raw Resume Text</h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {resumeData.resumeText}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {recommendations && recommendations.jobRecommendations && recommendations.jobRecommendations.length > 0 ? (
          <div className="mb-6">
            <div className="flex mb-6 border-b overflow-x-auto hide-scrollbar">
              {recommendations.jobRecommendations.map((job, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    activeTab === index
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {job.title} 
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                    {job.match}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md">
              {recommendations.jobRecommendations[activeTab] && (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-800">
                          {recommendations.jobRecommendations[activeTab].title}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {recommendations.jobRecommendations[activeTab].company}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {recommendations.jobRecommendations[activeTab].match} Match
                      </span>
                    </div>
                    <p className="text-gray-700 mt-4">
                      {recommendations.jobRecommendations[activeTab].description}
                    </p>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills:</h3>
                      <div className="flex flex-wrap gap-2">
                        {recommendations.jobRecommendations[activeTab].skills.map((skill, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Learning Path</h3>
                    <p className="text-gray-600 mb-6">
                      Complete these courses to enhance your skills and become more competitive for this role.
                    </p>

                    <div className="space-y-4">
                      {recommendations.jobRecommendations[activeTab].learningPath.map((course, idx) => (
                        <div key={idx} className="border rounded-lg overflow-hidden bg-white">
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                            onClick={() => toggleCourseExpand(idx)}
                          >
                            <div className="flex items-center">
                              <div className="bg-blue-100 rounded-full p-2 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{course.title}</h4>
                                <p className="text-sm text-gray-600">By {course.provider}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-1 rounded-full mr-3 ${getDifficultyColor(course.difficulty)}`}>
                                {course.difficulty}
                              </span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 text-gray-400 transition-transform ${expandedCourses[idx] ? 'rotate-180' : ''}`}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          
                          {expandedCourses[idx] && (
                            <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50">
                              <p className="text-gray-700 mb-4">{course.description}</p>
                              <a 
                                href={generateCourseUrl(course)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                              >
                                Find this course online
                                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Learning Paths Available</h2>
            <p className="text-gray-600 mb-4">Upload your resume on the dashboard to get personalized learning recommendations.</p>
            <a href="/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Go to Dashboard
            </a>
          </div>
        )}

  
        {recommendations && recommendations.aiInsights && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Career Insights
            </h3>
            <p className="text-gray-700">{recommendations.aiInsights}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Popular Learning Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="https://www.coursera.org/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <span>Coursera</span>
            </a>
            <a href="https://www.udemy.com/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span>Udemy</span>
            </a>
            <a href="https://www.linkedin.com/learning/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span>LinkedIn Learning</span>
            </a>
            <a href="https://www.pluralsight.com/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span>Pluralsight</span>
            </a>
            <a href="https://www.edx.org/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span>edX</span>
            </a>
            <a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 border rounded-lg hover:bg-blue-50">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span>freeCodeCamp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;