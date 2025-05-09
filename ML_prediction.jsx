import React, { useState } from 'react';
import { JobRecommendationService } from './JobRecommendationService';
import Sidebar from './Sidebar';

const ML_prediction = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('No file chosen');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [resumeText, setResumeText] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('recommendations');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File exceeds 5MB limit.');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setRecommendations(null);
      setResumeText(null);
      setExtractedSkills([]);
      setError(null);
    }
  };
  
  const handleBackToDashboard = () => {
    window.location.href = '/Dashboard'; // Adjust the route as necessary
  };
  
  // Handle file upload and prediction
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a resume file');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the service to get job recommendations
      const result = await JobRecommendationService.getJobRecommendations(file);
      
      console.log('API Result:', result); // For debugging
      
      // Store resume text if available
      if (result.resume_text) {
        setResumeText(result.resume_text);
      }
      
      // Store extracted skills
      if (result.extracted_skills) {
        setExtractedSkills(result.extracted_skills);
      }
      
      // Format the recommendations for display
      const formattedResults = result.formatted_recommendations || 
        JobRecommendationService.formatRecommendationResults(result);
      
      setRecommendations(formattedResults);
      setActiveTab('recommendations');
    } catch (err) {
      console.error('Error processing resume:', err);
      setError(err.message || 'Failed to process the resume');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate match color based on percentage
  const getMatchColor = (matchStr) => {
    const percentage = parseInt(matchStr.replace('%', ''));
    if (percentage >= 80) return 'text-green-800';
    if (percentage >= 60) return 'text-blue-600';
    return 'text-yellow-600';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 mr-6">
        <Sidebar />
      </div>
        <div className="flex-1 p-5 mb-6 bg-gray-50">
        {/*<h1 className="text-xl font-bold text-center mb-6">Model Prediction</h1> */}
        
        {/* File Upload Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white p-6 w-full mb-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-6 text-center">Upload Your Resume</h3>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}
            <div className="max-w-lg mx-auto">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop your resume file here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Supported formats: PDF, DOCX, TXT (Max: 5MB)
                </p>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Upload your resume to get personalized job matches and skill recommendations
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4 max-w-lg mx-auto">
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="flex-1 py-3 rounded-md font-medium bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            
            <button
              type="submit"
              disabled={!file || isLoading}
              className={`flex-1 py-3 rounded-md font-medium ${
                !file || isLoading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              } transition-colors`}
            >
              {isLoading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>
        </form>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        
        {/* Results Section */}
        {recommendations && (
          <div className="bg-gray-50 rounded-lg p-6">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'recommendations' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('recommendations')}
              >
                Job Recommendations
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === 'insights' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('insights')}
              >
                AI Insights
              </button>
              {resumeText && (
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'resume' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('resume')}
                >
                  Resume Text
                </button>
              )}
              {extractedSkills.length > 0 && (
                <button
                  className={`py-2 px-4 font-medium ${
                    activeTab === 'skills' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('skills')}
                >
                  Skills
                </button>
              )}
            </div>
            
            {/* Job Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Job Matches</h2>
                
                {recommendations.jobRecommendations && recommendations.jobRecommendations.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recommendations.jobRecommendations.map((job, index) => (
                      <div 
                        key={index} 
                        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 border-b border-gray-100">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                          <p className="text-gray-600 mb-2">{job.company}</p>
                          <span className={`font-medium ${getMatchColor(job.match)}`}>
                            {job.match}
                          </span>
                        </div>
                        
                        <div className="p-5">
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                              Skills Match
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                              Learning Path
                            </h4>
                            {job.learningPath.map((path, pathIndex) => (
                              <div key={pathIndex} className="mb-2 last:mb-0">
                                <p className="font-medium text-gray-800">{path.title}</p>
                                <p className="text-sm text-gray-600">
                                  <span className="text-blue-600">{path.provider}</span> • {path.difficulty}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No job recommendations available.</p>
                )}
              </div>
            )}
            
            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Career Insights</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {recommendations.aiInsights || "No insights available."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Resume Text Tab */}
            {activeTab === 'resume' && resumeText && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Extracted Resume Text</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {resumeText}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Extracted Skills</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {extractedSkills.length === 0 && (
                    <p className="text-gray-600">No skills were extracted from your resume.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ML_prediction;