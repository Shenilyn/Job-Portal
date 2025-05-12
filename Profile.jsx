import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { auth, db, storage } from './firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { deleteUser } from 'firebase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch the actual resume data from Firestore
  useEffect(() => {
    const fetchResumeData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('You must be logged in to view your settings');
          setIsLoading(false);
          return;
        }
        
        // Get the resume results from Firestore using the current user's ID
        const resumeDoc = await getDoc(doc(db, "resumeResults", user.uid));
        
        if (resumeDoc.exists()) {
          const data = resumeDoc.data();
          
          // Try to get the resume file URL from Firebase Storage if it exists
          if (data.resumeStoragePath) {
            try {
              const url = await getDownloadURL(ref(storage, data.resumeStoragePath));
              setResumeUrl(url);
            } catch (storageError) {
              console.error('Error fetching resume file:', storageError);
            }
          }
          
          // Set the complete resume data
          setResumeData(data);
          
          // If we have stored resume text, use it
          if (data.resumeText) {
            setResumeText(data.resumeText);
          }
        } else {
          setError('No resume data found. Please upload your resume on the dashboard first.');
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setError('Failed to load your resume data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  // Navigate to dashboard to update resume
  const handleUpdateResume = () => {
    navigate('/dashboard');
  };

  // View resume function to properly handle PDF files
  const handleViewResume = () => {
    if (resumeUrl) {
      // Open the PDF file in a new tab
      window.open(resumeUrl, '_blank', 'noopener,noreferrer');
    } else if (resumeText) {
      // Open plain text resume in a new tab
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');

      // Cleanup blob after short delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } else {
      alert('Resume file is not available for viewing');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not logged in');
      }
      
      // Delete resume document from Firestore
      await deleteDoc(doc(db, "resumeResults", user.uid));
      
      // Delete resume file from Storage if exists
      if (resumeData?.resumeStoragePath) {
        try {
          await deleteObject(ref(storage, resumeData.resumeStoragePath));
        } catch (storageError) {
          console.error('Error deleting resume file:', storageError);
          // Continue with account deletion even if file deletion fails
        }
      }
      
      // Delete user account
      await deleteUser(user);
      
      // Redirect to login page after successful deletion
      navigate('/login');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError('Failed to delete account: ' + error.message);
      setDeleteLoading(false);
    }
  };

  // Function to render a section of resume data
  const renderResumeSection = (title, content, isArray = false) => {
    if (!content || (isArray && content.length === 0)) return null;
    
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {isArray ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {content.map((item, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-gray-900">{content}</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="bg-white p-6 shadow-sm mb-6 rounded-lg">
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="text-gray-600">Manage your account and resume preferences</p>
        </div>
        
        {isLoading ? (
          <div className="bg-white p-8 rounded-lg shadow-sm flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <p>Loading your information...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            <p>{error}</p>
            <button 
              onClick={handleUpdateResume}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload Resume
            </button>
          </div>
        ) : (
          <>
            {/* Resume Information Section */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Resume Information</h2>
              <div className="mb-4">
                <div className="flex items-center text-blue-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">{resumeData?.fileName || 'Resume'}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Uploaded on {resumeData?.uploadedAt ? new Date(resumeData.uploadedAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
              
              {/* Basic Resume Information */}
              {renderResumeSection("Email", resumeData?.email || auth.currentUser?.email)}
              {renderResumeSection("Phone", resumeData?.phone)}
              {renderResumeSection("Location", resumeData?.location)}
              
              {/* Skills */}
              {resumeData?.geminiRecommendations?.extractedSkills && 
                renderResumeSection("Skills", resumeData.geminiRecommendations.extractedSkills, true)}
              
              {/* Education */}
              {resumeData?.geminiRecommendations?.education && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Education</h3>
                  <div className="mt-2 space-y-2">
                    {resumeData.geminiRecommendations.education.map((edu, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm">{edu.institution}</p>
                        {edu.year && <p className="text-sm text-gray-600">{edu.year}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Experience */}
              {resumeData?.geminiRecommendations?.experience && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Experience</h3>
                  <div className="mt-2 space-y-3">
                    {resumeData.geminiRecommendations.experience.map((exp, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">{exp.title}</p>
                        <p className="text-sm">{exp.company}</p>
                        {exp.duration && <p className="text-sm text-gray-600">{exp.duration}</p>}
                        {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Job Recommendations */}
              {resumeData?.geminiRecommendations?.jobRecommendations && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Job Recommendations</h3>
                  <div className="mt-2 space-y-3">
                    {resumeData.geminiRecommendations.jobRecommendations.map((job, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">{job.title}</p>
                        {job.description && <p className="text-sm mt-1">{job.description}</p>}
                        {job.skills && job.skills.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">Relevant Skills:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.skills.map((skill, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Learning Recommendations */}
              {resumeData?.geminiRecommendations?.learningRecommendations && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Learning Recommendations</h3>
                  <div className="mt-2 space-y-2">
                    {resumeData.geminiRecommendations.learningRecommendations.map((rec, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">{rec.skill}</p>
                        {rec.reason && <p className="text-sm mt-1">{rec.reason}</p>}
                        {rec.resources && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600">Resources:</p>
                            <ul className="list-disc list-inside mt-1 text-sm">
                              {rec.resources.map((resource, idx) => (
                                <li key={idx}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Feedback */}
              {resumeData?.geminiRecommendations?.feedback && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Resume Feedback</h3>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm">{resumeData.geminiRecommendations.feedback}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex items-center space-x-4">
                <button 
                  onClick={handleUpdateResume}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Resume
                </button>
                
               
              </div>
            </div>
            
            {/* Resume Preview Section */}
            {(resumeUrl || resumeText) && (
              <div className="p-6 bg-white rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Resume Preview</h2>
                
                {resumeUrl ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-4 h-96 bg-gray-50">
                      <object 
                        data={resumeUrl}
                        type="application/pdf"
                        className="w-full h-full"
                      >
                        <p>Your browser does not support PDFs. 
                          <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Click here to view</a>
                        </p>
                      </object>
                    </div>
                  </div>
                ) : resumeText ? (
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
                      {resumeText}
                    </pre>
                  </div>
                ) : null}
              </div>
            )}
            
            {/* Account Settings */}
            <div className="mt-6 p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <p className="text-sm mb-4">Manage your account preferences and privacy settings.</p>
             
              
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete Account
                </button>
                <p className="mt-2 text-sm text-gray-600">This will permanently remove your account and all associated data.</p>
              </div>
            </div>
            
            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Account</h3>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                  </p>
                  
                  {deleteError && (
                    <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
                      {deleteError}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </span>
                      ) : (
                        'Delete Account'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profie;