import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ResumeUpload from "./ResumeUpload";
import CurrentJobMatch from "./CurrentJobMatch";
import RecommendedJobs from "./RecommendedJobs";
import RecommendedCourses from "./RecommendedCourses";

const Dashboard = () => {
  const navigate = useNavigate();
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentJob, setCurrentJob] = useState("Software Developer");
  const [jobMatches, setJobMatches] = useState(null);

  const handleResumeUpload = (file) => {
    setResumeUploaded(true);
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
    }, 1500);
  };

  const handleGoToJobs = () => {
    navigate("/recommended-jobs"); // Navigate to the Recommended Jobs page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white p-6 shadow-md flex justify-between items-center">
          <h2 className="text-xl font-semibold font-[Poppins]">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              <span className="mr-2">Welcome,</span>
              <span className="font-medium">User</span>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6">
          {resumeUploaded ? (
            <>
              <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Resume Analysis</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Update Resume
                  </button>
                </div>
                <p className="text-gray-600">
                  Current file: <span className="font-medium">{fileName}</span>
                </p>
              </div>

              {jobMatches ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Job Match Component */}
                  <CurrentJobMatch currentJob={jobMatches.currentJob} />

                  {/* Recommended Jobs Component */}
                  <RecommendedJobs jobs={jobMatches.recommendedJobs} />

                  {/* Recommended Courses Component */}
                  <RecommendedCourses courses={jobMatches.recommendedCourses} />
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}

              {/* View Recommended Jobs Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleGoToJobs}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Recommended Jobs
                </button>
              </div>
            </>
          ) : (
            <ResumeUpload onResumeUpload={handleResumeUpload} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
