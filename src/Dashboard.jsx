import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ResumeUpload from "./ResumeUpload";
import CurrentJobMatch from "./CurrentJobMatch";
import RecommendedJobs from "./RecommendedJobs";
import RecommendedCourses from "./RecommendedCourses";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumeUploaded, setResumeUploaded] = useState(false); // Starting with false to show upload screen first
  const [fileName, setFileName] = useState("");
  const [currentJob, setCurrentJob] = useState("Software Developer");
  const [jobMatches, setJobMatches] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResumeUpload = (file) => {
    setLoading(true);
    setFileName(file.name);

    // Simulated response (replace with backend call)
    setTimeout(() => {
      setJobMatches({
        currentJob: {
          title: currentJob,
          overallMatch: 72,
          skills: [
            { name: "JavaScript", match: 85 },
            { name: "React", match: 65 },
            { name: "Node.js", match: 70 },
          ],
        },
        recommendedJobs: [
          {
            title: "Frontend Developer",
            skills: "HTML, CSS, JavaScript, React",
            match: 88,
          },
          {
            title: "Full Stack Developer",
            skills: "JavaScript, React, Node.js, MongoDB",
            match: 76,
          },
          {
            title: "UI/UX Developer",
            skills: "HTML, CSS, JavaScript, Figma",
            match: 68,
          },
        ],
        recommendedCourses: [
          {
            title: "Advanced React Patterns & Performance",
            duration: "10 hours",
          },
          {
            title: "MongoDB for JavaScript Developers",
            duration: "8 hours",
          },
          {
            title: "UI/UX Design Fundamentals with Figma",
            duration: "12 hours",
          },
        ],
      });
      setResumeUploaded(true);
      setLoading(false);
    }, 1500);
  };

  const handleGoToJobs = () => {
    navigate("/recommended-jobs");
  };

  const handleUpdateResume = () => {
    setResumeUploaded(false);
    setJobMatches(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white p-6 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              <span className="mr-2">Welcome,</span>
              <span className="font-medium">User</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Analyzing your resume...</p>
            </div>
          ) : resumeUploaded ? (
            <>
              <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Resume Analysis</h3>
                    <p className="text-gray-600 mt-2">
                      Current file: <span className="font-medium">{fileName}</span>
                    </p>
                  </div>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={handleUpdateResume}
                  >
                    Update Resume
                  </button>
                </div>
              </div>

              {jobMatches && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Current Job Match */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Current Job Match</h3>
                      <div className="flex items-start">
                        <div className="relative w-24 h-24 mr-6">
                          <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#E6E6E6"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#1E88E5"
                              strokeWidth="3"
                              strokeDasharray={`${jobMatches.currentJob.overallMatch}, 100`}
                            />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-xl font-bold">{jobMatches.currentJob.overallMatch}%</div>
                            <div className="text-xs text-gray-500">Match</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium mb-1">{jobMatches.currentJob.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">Based on your resume</p>
                          
                          <div className="mt-4">
                            <h5 className="text-sm font-medium mb-2">Skills Analysis</h5>
                            {jobMatches.currentJob.skills.map((skill) => (
                              <div key={skill.name} className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>{skill.name}</span>
                                  <span>{skill.match}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${skill.match}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Jobs */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-4">Recommended Jobs</h3>
                      <div className="space-y-4">
                        {jobMatches.recommendedJobs.map((job, index) => (
                          <div 
                            key={index} 
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{job.title}</h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  Skills: {job.skills}
                                </p>
                              </div>
                              <div className={`px-3 py-1 rounded-lg text-sm ${
                                job.match >= 85 ? 'bg-green-100 text-green-800' :
                                job.match >= 75 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {job.match}% Match
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Learning */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Recommended Learning</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {jobMatches.recommendedCourses.map((course, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-2">{course.title}</h4>
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">{course.duration}</div>
                            <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-6 text-center">Upload Your Resume</h3>
              <div className="max-w-lg mx-auto">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 text-center">
                  <div className="mb-4">
                    <svg 
                      className="mx-auto h-12 w-12 text-blue-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="1"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop your resume file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    Supported formats: PDF, DOCX, DOC (Max: 5MB)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleResumeUpload(e.target.files[0]);
                      }
                    }}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;