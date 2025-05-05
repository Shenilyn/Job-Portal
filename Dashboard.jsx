import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { auth, db } from "./firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";


let genAI = null;
let isGeminiEnabled = false;

function ResumeAnalysis({ resumeUploaded }) {
  const modelPath = "./model3.h5";
  const [modelProcessing, setModelProcessing] = useState(false);
  const [jobMatches, setJobMatches] = useState([]);
  const displayAnalysisResults = () => {
    setModelProcessing(true);
    setTimeout(() => {
      const displayMatches = [
        { title: "Software Engineer", score: 0.87 },
        { title: "Web Developer", score: 0.82 },
        { title: "Frontend Developer", score: 0.79 }
      ];
      setJobMatches(displayMatches);
      setModelProcessing(false);
    }, 2000);
  };

  useEffect(() => {
    if (resumeUploaded) {
      displayAnalysisResults();
    }
  }, [resumeUploaded]);

  return (
    <div className="resume-analysis-panel">
      <h2>Resume Analysis</h2>
      {console.log("Model path (not used):", modelPath)}
      
      {modelProcessing ? (
        <div className="analysis-loading">
          <div className="spinner"></div>
          <p>Processing your resume...</p>
        </div>
      ) : (
        <div className="analysis-results">
          {jobMatches.length > 0 ? (
            <>
              <h3>Based on your resume, here are your potential job matches:</h3>
              <ul className="matches-list">
                {jobMatches.map((match, index) => (
                  <li key={index} className="match-item">
                    <span className="job-title">{match.title}</span>
                    <span className="match-score">{Math.round(match.score * 100)}% Match</span>
                  </li>
                ))}
              </ul>
            </>
          ) : resumeUploaded ? (
            <p>No matches found. Try uploading a more detailed resume.</p>
          ) : (
            <p>Upload your resume to see potential job matches.</p>
          )}
        </div>
      )}
    </div>
  );
}
const initializeGemini = () => {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (API_KEY && API_KEY !== "VITE_GEMINI_API_KEY" && API_KEY.length > 10) {
      genAI = new GoogleGenerativeAI(API_KEY);
      isGeminiEnabled = true;
      console.log("Gemini API initialized successfully");
      return true;
    } else {
      console.warn("Gemini API key not properly configured. Using fallback mode.");
      return false;
    }
  } catch (error) {
    console.error("Failed to initialize Gemini:", error);
    return false;
  }
};

const extractTextFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || sessionStorage.getItem("gemini_api_key");
        
        if (file.type === 'application/pdf') {
          if (!API_KEY) {
            reject(new Error("API key is missing. Cannot extract text from PDF."));
            return;
          }
          
          // Convert PDF to base64
          const base64Data = event.target.result.split(',')[1];
          
          // Using Gemini to extract text from PDF
          const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
          
          const requestBody = {
            contents: [
              {
                parts: [
                  {
                    text: "Please extract all text content from this PDF document. Return only the extracted text content, without any additional explanations or commentary:"
                  },
                  {
                    inline_data: {
                      mime_type: "application/pdf",
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2048
            }
          };
          
          console.log("Sending PDF to Gemini API for extraction...");
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
          }
          
          const data = await response.json();
          
          // Extract text from response
          if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts.length > 0) {
            const extractedText = data.candidates[0].content.parts[0].text;
            console.log("Successfully extracted text from PDF");
            resolve(extractedText);
          } else {
            console.error("Unexpected API response structure:", data);
            throw new Error("Failed to extract text from PDF");
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                   file.type === 'application/msword') {
          // For Word documents, same approach with Gemini API
          if (!API_KEY) {
            reject(new Error("API key is missing. Cannot extract text from Word document."));
            return;
          }
          
          // Convert Word doc to base64
          const base64Data = event.target.result.split(',')[1];
          
          // Using Gemini to extract text from Word doc
          const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
          
          const requestBody = {
            contents: [
              {
                parts: [
                  {
                    text: "Please extract all text content from this Word document. Return only the extracted text content, without any additional explanations or commentary:"
                  },
                  {
                    inline_data: {
                      mime_type: file.type,
                      data: base64Data
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 2048
            }
          };
          
          console.log("Sending Word document to Gemini API for extraction...");
          const response = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
          }
          
          const data = await response.json();
          
          // Extract text from response
          if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts.length > 0) {
            const extractedText = data.candidates[0].content.parts[0].text;
            console.log("Successfully extracted text from Word document");
            resolve(extractedText);
          } else {
            console.error("Unexpected API response structure:", data);
            throw new Error("Failed to extract text from Word document");
          }
        } else {
          // For plain text files, just use the FileReader result directly
          const text = event.target.result;
          resolve(text);
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        reject(new Error("Failed to parse the file. Please try a different format."));
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(new Error("Error reading the file. Please try again."));
    };
    
    // Use readAsDataURL for PDFs and Word docs to get base64
    if (file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.type === 'application/msword') {
      reader.readAsDataURL(file);
    } else {
      // For text files
      reader.readAsText(file);
    }
  });
};

const getGeminiRecommendations = async (resumeText) => {
  if (!isGeminiEnabled || !genAI) {
    throw new Error("Gemini API is not configured properly");
  }
  
  try {
    // Error is here - using correct model name "gemini-1.5-flash" instead of "gemini-2.0-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
       As an AI career assistant, analyze the following resume content and provide:
      1. Top 3 job recommendations that match the candidate's skills and experience
      2. A match percentage for each job (how well the person fits)
      3. A short job description for each recommendation
      4. Key skills required for each job (exactly 4 skills per job)
      5. A learning path for each job with 3-4 specific courses or resources to help the person upskill
      6. Brief career advice or insights based on the resume
      
      Format your response as structured JSON only, with no additional text, using this exact structure:
      {
        "jobRecommendations": [
          {
            "title": "Job Title",
            "company": "Example Company Type",
            "match": "XX%",
            "description": "Brief job description",
            "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
            "learningPath": [
              {
                "title": "Course or Resource Title",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description of what this course covers"
              },
              {
                "title": "Second Course",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              },
              {
                "title": "Third Course",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              }
            ]
          },
          {
            "title": "Second Job Title",
            "company": "Another Company Type",
            "match": "XX%",
            "description": "Brief job description",
            "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
            "learningPath": [
              {
                "title": "Course or Resource Title",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              },
              {
                "title": "Second Course",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              },
              {
                "title": "Third Course",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              }
            ]
          },
          {
            "title": "Third Job Title",
            "company": "Third Company Type",
            "match": "XX%",
            "description": "Brief job description",
            "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
            "learningPath": [
              {
                "title": "Course or Resource Title",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description of what this course covers"
              },
              {
                "title": "Second Course",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              },
              {
                "title": "Third Course",
                "provider": "Provider Name",
                "difficulty": "Beginner/Intermediate/Advanced",
                "description": "Brief description"
              }
            ]
          }
        ],
        "aiInsights": "Brief career advice based on resume analysis"
      }
      
      Resume content:
      ${resumeText}
    `;
    
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };
    
    const safetySettings = [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ];
    
    // Generate content with the configured settings
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings
    });
    
    const response = await result.response;
    const textResponse = response.text();
    
    // Enhanced JSON parsing with better error handling
    let jsonResponse;
    try {
      // Try to parse the response as JSON directly
      jsonResponse = JSON.parse(textResponse);
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || 
                      textResponse.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonString = jsonMatch[1] || jsonMatch[0];
        try {
          jsonResponse = JSON.parse(jsonString);
        } catch (jsonError) {
          console.error("Failed to parse extracted JSON:", jsonError);
          throw new Error("Invalid JSON format in response");
        }
      } else {
        console.error("Could not parse Gemini response as JSON:", textResponse);
        throw new Error("Could not parse Gemini response as JSON");
      }
    }
    
    // Validate the JSON structure to ensure it has the expected format
    if (!jsonResponse || !jsonResponse.jobRecommendations || !Array.isArray(jsonResponse.jobRecommendations)) {
      throw new Error("Invalid response format from Gemini API");
    }
    
    return jsonResponse;
    
  } catch (error) {
    console.error("Error getting recommendations from Gemini:", error);
    throw error;
  }
};

// UPDATED: Dynamic job recommendations based on filename patterns
const generateDynamicJobMatches = (fileName, resumeText = "") => {
  // Convert filename to lowercase for easier matching
  const lowerFileName = fileName.toLowerCase();
  
  // Set default jobs
  let topJobs = [
    { title: "Software Developer", company: "Tech Solutions Inc." },
    { title: "Web Developer", company: "Digital Creations" },
    { title: "Frontend Engineer", company: "UX Innovations" }
  ];
  
  // Default skills
  let skills = {
    present: ["JavaScript", "React", "HTML", "CSS"],
    missing: ["TypeScript", "Node.js", "AWS"]
  };
  
  // Determine job recommendations based on filename patterns
  if (lowerFileName.includes("dev") || lowerFileName.includes("software") || lowerFileName.includes("code")) {
    topJobs = [
      { title: "Senior Software Engineer", company: "Tech Innovations" },
      { title: "Full Stack Developer", company: "Web Solutions Ltd." },
      { title: "DevOps Engineer", company: "Cloud Systems Inc." }
    ];
    skills.present = ["JavaScript", "Python", "Git", "Docker"];
    skills.missing = ["Kubernetes", "AWS", "CI/CD"];
  } 
  else if (lowerFileName.includes("data") || lowerFileName.includes("analyst") || lowerFileName.includes("science")) {
    topJobs = [
      { title: "Data Scientist", company: "Analytics Co." },
      { title: "Business Intelligence Analyst", company: "Data Insights" },
      { title: "Machine Learning Engineer", company: "AI Solutions" }
    ];
    skills.present = ["Python", "SQL", "Data Visualization", "Statistics"];
    skills.missing = ["TensorFlow", "Big Data", "Cloud Platforms"];
  }
  else if (lowerFileName.includes("design") || lowerFileName.includes("ui") || lowerFileName.includes("ux")) {
    topJobs = [
      { title: "UI/UX Designer", company: "Creative Designs Inc." },
      { title: "Product Designer", company: "User Experience Lab" },
      { title: "Interaction Designer", company: "Digital Products Co." }
    ];
    skills.present = ["Figma", "UI Design", "Wireframing", "User Research"];
    skills.missing = ["Motion Design", "Design Systems", "Frontend Coding"];
  }
  else if (lowerFileName.includes("market") || lowerFileName.includes("sales") || lowerFileName.includes("business")) {
    topJobs = [
      { title: "Marketing Manager", company: "Growth Strategies Inc." },
      { title: "Sales Representative", company: "Business Solutions" },
      { title: "Digital Marketing Specialist", company: "Online Presence Co." }
    ];
    skills.present = ["Marketing Strategy", "Customer Relations", "Social Media", "Analytics"];
    skills.missing = ["SEO", "Content Marketing", "Marketing Automation"];
  }
  else if (lowerFileName.includes("manager") || lowerFileName.includes("lead") || lowerFileName.includes("director")) {
    topJobs = [
      { title: "Project Manager", company: "Enterprise Solutions" },
      { title: "Team Lead", company: "Agile Innovations" },
      { title: "Department Director", company: "Corporate Strategies" }
    ];
    skills.present = ["Team Leadership", "Project Planning", "Stakeholder Management", "Budgeting"];
    skills.missing = ["Agile Methodologies", "Resource Optimization", "Strategic Planning"];
  }
  // Extract potential field from the resume text if available
  else if (resumeText) {
    const lowerResumeText = resumeText.toLowerCase();
    
    if (lowerResumeText.includes("engineer") || lowerResumeText.includes("developer")) {
      topJobs = [
        { title: "Software Engineer", company: "Digital Systems Inc." },
        { title: "Backend Developer", company: "Server Solutions" },
        { title: "Mobile App Developer", company: "App Creators Ltd." }
      ];
    }
    else if (lowerResumeText.includes("finance") || lowerResumeText.includes("account")) {
      topJobs = [
        { title: "Financial Analyst", company: "Capital Management" },
        { title: "Accountant", company: "Financial Solutions" },
        { title: "Financial Controller", company: "Corporate Finance" }
      ];
      skills.present = ["Financial Analysis", "Excel", "Accounting Principles", "Reporting"];
      skills.missing = ["Financial Modeling", "SAP", "Forecasting"];
    }
  }
  
  // Generate a unique timestamp for each upload
  return {
    topJobs,
    skills,
    fileName,
    processedAt: new Date().toISOString()
  };
};

// Function to get top 3 recommendations from available data
const getTop3Recommendations = (allRecommendations) => {
  // If we have Gemini recommendations, use those
  if (allRecommendations && allRecommendations.jobRecommendations) {
    // Sort by match percentage (convert XX% to number)
    const sortedJobs = [...allRecommendations.jobRecommendations].sort((a, b) => {
      const matchA = parseInt(a.match.replace('%', ''));
      const matchB = parseInt(b.match.replace('%', ''));
      return matchB - matchA;
    });
    
    // Return top 3 (or fewer if less available)
    return {
      jobRecommendations: sortedJobs.slice(0, 3),
      aiInsights: allRecommendations.aiInsights
    };
  }
  
  // Fallback to empty structure if no recommendations available
  return {
    jobRecommendations: [],
    aiInsights: "No recommendations available. Please try uploading your resume again."
  };
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [jobMatches, setJobMatches] = useState(null);
  const [geminiRecommendations, setGeminiRecommendations] = useState(null);
  const [top3Recommendations, setTop3Recommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [top3Loading, setTop3Loading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [geminiStatus, setGeminiStatus] = useState({
    initialized: false,
    enabled: false,
    message: "Checking Gemini API status..."
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showLearningPaths, setShowLearningPaths] = useState({});

  ResumeAnalysis({resumeUploaded: true}); // Example function reference
  // Initialize Gemini on component mount
  useEffect(() => {
    // Check if there's a stored API key in session storage
    const storedApiKey = sessionStorage.getItem("gemini_api_key");
    if (storedApiKey) {
      try {
        genAI = new GoogleGenerativeAI(storedApiKey);
        isGeminiEnabled = true;
        setGeminiStatus({
          initialized: true,
          enabled: true,
          message: "Gemini API ready for use (using stored key)"
        });
      } catch (error) {
        console.error("Failed to initialize Gemini with stored key:", error);
        // Continue with the default initialization
        const geminiEnabled = initializeGemini();
        setGeminiStatus({
          initialized: true,
          enabled: geminiEnabled,
          message: geminiEnabled 
            ? "Gemini API ready for use" 
            : "Gemini API not available. Please configure your API key in environment variables or enter it below."
        });
      }
    } else {
      // Regular initialization
      const geminiEnabled = initializeGemini();
      setGeminiStatus({
        initialized: true,
        enabled: geminiEnabled,
        message: geminiEnabled 
          ? "Gemini API ready for use" 
          : "Gemini API not available. Please configure your API key in environment variables or enter it below."
      });
    }
  }, []);

  // Function to manually set API key
  const handleSetApiKey = () => {
    if (apiKeyInput && apiKeyInput.length > 10) {
      try {
        genAI = new GoogleGenerativeAI(apiKeyInput);
        isGeminiEnabled = true;
        setGeminiStatus({
          initialized: true,
          enabled: true,
          message: "Gemini API successfully configured!"
        });
        setShowApiKeyInput(false);
        // Store in session storage (not local storage for security)
        sessionStorage.setItem("gemini_api_key", apiKeyInput);
      } catch (error) {
        console.error("Failed to initialize Gemini with provided key:", error);
        setGeminiStatus({
          initialized: true,
          enabled: false,
          message: "Invalid API key. Please check and try again."
        });
      }
    } else {
      setGeminiStatus({
        initialized: true,
        enabled: false,
        message: "API key too short or invalid. Please enter a valid key."
      });
    }
  };

  const handleResumeUpload = async (file) => {
    setLoading(true);
    setGeminiLoading(true);
    setErrorMsg("");
    setFileName(file.name);
  
    const user = auth.currentUser;
    if (!user) {
      setErrorMsg("User not logged in.");
      setLoading(false);
      setGeminiLoading(false);
      return;
    }
  
    try {
      // Extract text from the resume file
      const extractedText = await extractTextFromFile(file);
      setResumeText(extractedText);
      
      // Generate dynamic job matches based on filename and content
      const dynamicResults = generateDynamicJobMatches(file.name, extractedText);
      setJobMatches(dynamicResults);
      setLoading(false);
      setResumeUploaded(true);
      
      // If Gemini is enabled, use the API to get recommendations
      if (geminiStatus.enabled) {
        try {
          // Get job recommendations from Gemini
          const aiRecommendations = await getGeminiRecommendations(extractedText);
          setGeminiRecommendations(aiRecommendations);
          
          // Save to Firestore
          await setDoc(doc(db, "resumeResults", user.uid), {
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
            jobMatches: dynamicResults,
            geminiRecommendations: aiRecommendations
          });
          
          // Auto-generate top 3 recommendations
          setTop3Recommendations(getTop3Recommendations(aiRecommendations));
          
        } catch (geminiError) {
          console.error("Gemini processing failed:", geminiError);
          setErrorMsg("Failed to process resume with Gemini. Please ensure your API key is valid.");
          setGeminiRecommendations({
            jobRecommendations: [],
            aiInsights: "Unable to generate insights due to API issues. Please check your Gemini API configuration."
          });
        } finally {
          setGeminiLoading(false);
        }
      } else {
        // If Gemini is not enabled, let the user know we need an API key
        setGeminiRecommendations({
          jobRecommendations: [],
          aiInsights: "Gemini API key not configured. Please add a valid API key to enable AI-powered recommendations."
        });
        setGeminiLoading(false);
      }
  
    } catch (err) {
      console.error("Processing failed:", err);
      setErrorMsg("Resume processing failed. Please try again with a different file or format.");
      setLoading(false);
      setGeminiLoading(false);
      setResumeUploaded(false);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTop3 = async () => {
    setTop3Loading(true);
    setErrorMsg("");
    
    try {
      if (!geminiStatus.enabled) {
        setErrorMsg("Cannot generate recommendations. Gemini API key is not configured properly.");
        setTop3Loading(false);
        return;
      }
      
      if (resumeText) {
     
        const recommendations = await getGeminiRecommendations(resumeText);
        setGeminiRecommendations(recommendations); 
        setTop3Recommendations(getTop3Recommendations(recommendations));
      } else if (geminiRecommendations) {
       
        setTop3Recommendations(getTop3Recommendations(geminiRecommendations));
      } else {
        throw new Error("No resume text or recommendations available");
      }
    } catch (error) {
      console.error("Failed to generate top 3 recommendations:", error);
      setErrorMsg("Failed to generate recommendations. Please check your API key configuration or try again later.");
      
      setTop3Recommendations({
        jobRecommendations: [],
        aiInsights: "Unable to generate recommendations. Please make sure your Gemini API is correctly configured."
      });
    } finally {
      setTop3Loading(false);
    }
  };

  const handleGoToJobs = () => {
    navigate("/recommended-jobs");
  };

  const handleUpdateResume = () => {
    setResumeUploaded(false);
    setJobMatches(null);
    setGeminiRecommendations(null);
    setTop3Recommendations(null);
    setFileName("");
    setResumeText("");
    setErrorMsg("");
  };

  // Toggle function to show/hide learning path for a job
  const toggleLearningPath = (jobIndex) => {
    setShowLearningPaths(prev => ({
      ...prev,
      [jobIndex]: !prev[jobIndex]
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <div className="bg-white p-6 shadow-sm flex justify-between items-center">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              <span className="mr-2">Welcome,</span>
              <span className="font-medium">{auth.currentUser?.email}</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {auth.currentUser?.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Enhanced API Status Indicator with API Key Input Option */}
        {geminiStatus.initialized && (
          <div className={`mx-6 mt-4 p-3 rounded-md ${geminiStatus.enabled ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${geminiStatus.enabled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm">{geminiStatus.message}</span>
              </div>
              {!geminiStatus.enabled && (
                <div className="flex items-center">
                  <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="mr-3 text-xs underline text-blue-600">
                    Get API Key
                  </a>
                  <button 
                    onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition"
                  >
                    {showApiKeyInput ? "Hide" : "Enter Key"}
                  </button>
                </div>
              )}
            </div>

            {/* API Key Input Form */}
            {showApiKeyInput && !geminiStatus.enabled && (
              <div className="mt-3 flex">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your Gemini API key here"
                  className="flex-grow border rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSetApiKey}
                  className="bg-blue-600 text-white px-3 py-2 rounded-r text-sm hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Analyzing your resume...</p>
            </div>
          ) : resumeUploaded ? (
            <div className="space-y-6">
              {/* Error message display - moved to top for better visibility */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}
              
              {/* Resume File Info Display */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Current Resume: {fileName}</p>
                    <p className="text-xs text-blue-600">Uploaded on {new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Generate Top 3 Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerateTop3}
                  disabled={top3Loading || !geminiStatus.enabled}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center transition transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 mb-4"
                >
                  {top3Loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Analyze 
                    </>
                  )}
                </button>
              </div>
              
              {/* Top 3 Recommendations Section (Shows only after button click) */}
              {top3Recommendations && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-blue-800">Your Top 3 Job Matches</h3>
                  </div>
                  
                  {top3Recommendations.jobRecommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {top3Recommendations.jobRecommendations.map((job, idx) => (
                        <div key={idx} className={`border rounded-lg p-5 ${idx === 0 ? 'bg-white shadow-md transform scale-105 border-blue-300' : 'bg-white/80'} transition hover:shadow-lg`}>
                          {idx === 0 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-white px-2 py-1 rounded-full">
                              TOP MATCH
                            </div>
                          )}
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-blue-800">{job.title}</h4>
                            <span className={`${idx === 0 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'} text-xs px-2 py-1 rounded-full font-bold`}>
                              {job.match}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{job.company}</p>
                          <p className="text-gray-700 text-sm mt-2">{job.description}</p>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {job.skills.map((skill, sIdx) => (
                              <span 
                                key={sIdx} 
                                className={`${idx === 0 ? 'bg-blue-100 text-blue-800' : 'bg-blue-50 text-blue-700'} text-xs px-2 py-1 rounded`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          
                          {/* Learning Path Section - NEW ADDITION */}
                          <div className="mt-4 pt-3 border-t">
                            <button 
                              onClick={() => toggleLearningPath(idx)}
                              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition font-medium flex items-center justify-between"
                            >
                              <span>Learning Path</span>
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-4 w-4 transition-transform ${showLearningPaths[idx] ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            
                            {showLearningPaths[idx] && job.learningPath && (
                              <div className="mt-3 space-y-3 bg-blue-50 p-3 rounded-md">
                                <h5 className="font-medium text-sm text-blue-900">Recommended Learning:</h5>
                                {job.learningPath.map((course, cIdx) => (
                                  <div key={cIdx} className="bg-white p-2 rounded border border-blue-100">
                                    <div className="flex justify-between">
                                      <h6 className="font-medium text-sm">{course.title}</h6>
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                        {course.difficulty}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">By {course.provider}</p>
                                    <p className="text-xs text-gray-700 mt-1">{course.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                      <p className="text-gray-700 text-center">No job recommendations available. Please try generating recommendations again or upload a more detailed resume.</p>
                    </div>
                  )}
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="text-sm font-medium text-blue-800">Career Insights</h4>
                    </div>
                    <p className="text-sm text-gray-700">{top3Recommendations.aiInsights}</p>
                  </div>
                </div>
              )}
              
             

              {/* Additional Job Matches Section */}
              <div className="bg-white p-6 rounded-lg shadow">
                

                <div className="mt-6 flex space-x-4">
                 
                  <button
                    onClick={handleUpdateResume}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                  >
                    Upload New Resume
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-6 text-center">Upload Your Resume</h3>
              {errorMsg && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                  {errorMsg}
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
                    Supported formats: PDF, DOCX, DOC (Max: 5MB)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          setErrorMsg("File exceeds 5MB limit.");
                          return;
                        }
                        handleResumeUpload(file);
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
                  Upload your resume to get personalized job matches and skill recommendations from Gemini AI
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