import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { auth, db } from "./firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as tf from '@tensorflow/tfjs';

let genAI = null;
let isGeminiEnabled = false;
let jobRecommendationModel = null;

// Initialize the TensorFlow model for job recommendations
const initializeJobModel = async () => {
  try {
    // Load the model from the specified path
    jobRecommendationModel = await tf.loadLayersModel('./model3.h5');
    console.log("Job recommendation model loaded successfully");
    return true;
  } catch (error) {
    console.error("Failed to load job recommendation model:", error);
    return false;
  }
};

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

// Function to preprocess resume text for model input
const preprocessResumeText = (resumeText) => {
  try {
    // Basic preprocessing: lowercase, remove special characters, tokenize
    const cleanedText = resumeText.toLowerCase().replace(/[^\w\s]/g, ' ');
    const tokens = cleanedText.split(/\s+/).filter(token => token.length > 0);
    
    // Count word frequencies as a simple feature extraction
    const wordCounts = {};
    const commonSkills = [
      "javascript", "react", "python", "java", "c++", "css", "html", "sql", "node", 
      "typescript", "aws", "azure", "docker", "kubernetes", "git", "mongodb", "postgresql",
      "leadership", "management", "marketing", "sales", "design", "figma", "ui", "ux",
      "analytics", "data", "machine", "learning", "ai", "finance", "accounting"
    ];
    
    // Initialize counts for common skills
    commonSkills.forEach(skill => {
      wordCounts[skill] = 0;
    });
    
    // Count occurrences
    tokens.forEach(token => {
      if (commonSkills.includes(token)) {
        wordCounts[token] = (wordCounts[token] || 0) + 1;
      }
    });
    
    // Convert to feature vector (normalize by resume length)
    const featureVector = Object.values(wordCounts);
    const totalWords = tokens.length;
    const normalizedFeatures = featureVector.map(count => count / totalWords);
    
    // Create tensor with appropriate shape for model input
    return tf.tensor2d([normalizedFeatures]);
  } catch (error) {
    console.error("Error preprocessing resume text:", error);
    // Return a fallback feature vector with zeros
    return tf.tensor2d([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]);
  }
};

// Function to get top 3 job recommendations using the ML model
const getModelRecommendations = async (resumeText) => {
  try {
    if (!jobRecommendationModel) {
      throw new Error("Job recommendation model not initialized");
    }
    
    // Preprocess resume text for model input
    const inputFeatures = preprocessResumeText(resumeText);
    
    // Run prediction
    const predictions = await jobRecommendationModel.predict(inputFeatures);
    const predictionArray = await predictions.array();
    
    // Job categories that the model can predict
    const jobCategories = [
      { title: "Software Engineer", company: "Tech Solutions Inc." },
      { title: "Data Scientist", company: "Analytics Co." },
      { title: "Product Manager", company: "Product Innovations" },
      { title: "UX Designer", company: "Creative Design Studio" },
      { title: "Full Stack Developer", company: "Web Solutions Ltd." },
      { title: "Machine Learning Engineer", company: "AI Research Group" },
      { title: "DevOps Engineer", company: "Cloud Systems Inc." },
      { title: "Business Analyst", company: "Business Intelligence Corp." },
      { title: "Frontend Developer", company: "UI Specialists" },
      { title: "Backend Developer", company: "Server Architecture Ltd." }
    ];
    
    // Map prediction scores to job categories and sort by score
    const scoresByJob = predictionArray[0].map((score, index) => ({
      score,
      job: jobCategories[index % jobCategories.length] // In case predictions length > jobCategories length
    }));
    
    // Sort by score (highest first)
    scoresByJob.sort((a, b) => b.score - a.score);
    
    // Take top 3
    const top3Jobs = scoresByJob.slice(0, 3);
    
    // Format the jobs with match percentages
    return top3Jobs.map(item => ({
      title: item.job.title,
      company: item.job.company,
      match: `${Math.round(item.score * 100)}%`,
      description: `This role is a great match based on your skills and experience.`,
      skills: getJobSkills(item.job.title)
    }));
  } catch (error) {
    console.error("Error getting model recommendations:", error);
    // Return fallback recommendations
    return [
      { 
        title: "Software Engineer", 
        company: "Tech Solutions Inc.", 
        match: "85%",
        description: "Build and maintain software applications using various programming languages.",
        skills: ["JavaScript", "React", "Node.js", "Git"]
      },
      { 
        title: "Data Analyst", 
        company: "Data Insights Co.", 
        match: "78%",
        description: "Analyze large datasets to extract insights and support business decisions.",
        skills: ["SQL", "Excel", "Data Visualization", "Statistics"]
      },
      { 
        title: "Product Manager", 
        company: "Product Innovations", 
        match: "72%",
        description: "Lead product development from conception to launch, working with cross-functional teams.",
        skills: ["Product Strategy", "User Research", "Agile", "Communication"]
      }
    ];
  }
};

// Function to get default skills based on job title
const getJobSkills = (jobTitle) => {
  const jobSkillsMap = {
    "Software Engineer": ["JavaScript", "Python", "Git", "System Design"],
    "Data Scientist": ["Python", "Machine Learning", "SQL", "Statistics"],
    "Product Manager": ["Product Strategy", "User Research", "Agile", "Communication"],
    "UX Designer": ["Figma", "User Research", "Wireframing", "Prototyping"],
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "MongoDB"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "PyTorch", "Data Modeling"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "Cloud Infrastructure"],
    "Business Analyst": ["Data Analysis", "SQL", "Requirements Gathering", "Presentation"],
    "Frontend Developer": ["JavaScript", "React", "CSS", "HTML"],
    "Backend Developer": ["Node.js", "Python", "Databases", "API Design"]
  };
  
  return jobSkillsMap[jobTitle] || ["Problem Solving", "Communication", "Technical Skills", "Teamwork"];
};

const getGeminiRecommendations = async (resumeText, modelRecommendations) => {
  if (!isGeminiEnabled || !genAI) {
    throw new Error("Gemini API is not configured properly");
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Build the prompt using the ML model recommendations
    const modelRecommendationsText = modelRecommendations.map(job => 
      `- ${job.title} at ${job.company} (Match: ${job.match})`
    ).join('\n');
    
    const prompt = `
      I have a resume and my ML model has already identified these top 3 job matches:
      ${modelRecommendationsText}
      
      For each of these 3 jobs, I need you to:
      1. Create a detailed job description (2-3 sentences)
      2. List exactly 4 key skills required for each job
      3. Design a learning path with 3-4 specific courses or resources to help the person upskill for each job
      4. Provide brief career advice based on the resume analysis
      
      Format your response as structured JSON only, with no additional text, using this exact structure:
      {
        "jobRecommendations": [
          {
            "title": "Job Title from my ML model",
            "company": "Company from my ML model",
            "match": "Match percentage from my ML model",
            "description": "Your detailed job description here",
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
          // Repeat for the second and third job
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
    
    // Ensure Gemini preserves the model-predicted match percentages
    for (let i = 0; i < Math.min(modelRecommendations.length, jsonResponse.jobRecommendations.length); i++) {
      jsonResponse.jobRecommendations[i].match = modelRecommendations[i].match;
      jsonResponse.jobRecommendations[i].title = modelRecommendations[i].title;
      jsonResponse.jobRecommendations[i].company = modelRecommendations[i].company;
    }
    
    return jsonResponse;
    
  } catch (error) {
    console.error("Error getting recommendations from Gemini:", error);
    throw error;
  }
};

// Function to get top 3 recommendations from available data
const getTop3Recommendations = (aiRecommendations, modelRecommendations) => {
  // If we have both sets of recommendations, merge them
  if (aiRecommendations && aiRecommendations.jobRecommendations && modelRecommendations) {
    const mergedRecommendations = {
      jobRecommendations: [],
      aiInsights: aiRecommendations.aiInsights || "Review your resume to highlight skills relevant to your target roles."
    };
    
    // Use model recommendations for job titles, companies, and match percentages
    // Use Gemini recommendations for detailed descriptions and learning paths
    for (let i = 0; i < Math.min(3, modelRecommendations.length); i++) {
      if (i < aiRecommendations.jobRecommendations.length) {
        // Merge model data with Gemini data
        mergedRecommendations.jobRecommendations.push({
          title: modelRecommendations[i].title,
          company: modelRecommendations[i].company,
          match: modelRecommendations[i].match,
          description: aiRecommendations.jobRecommendations[i].description || modelRecommendations[i].description,
          skills: aiRecommendations.jobRecommendations[i].skills || modelRecommendations[i].skills,
          learningPath: aiRecommendations.jobRecommendations[i].learningPath || []
        });
      } else {
        // Just use model data if we don't have corresponding Gemini data
        mergedRecommendations.jobRecommendations.push({
          ...modelRecommendations[i],
          learningPath: []
        });
      }
    }
    
    return mergedRecommendations;
  }
  
  // If we only have model recommendations, return them in the expected format
  if (modelRecommendations) {
    return {
      jobRecommendations: modelRecommendations.map(job => ({
        ...job,
        learningPath: []
      })),
      aiInsights: "Review your resume to highlight skills relevant to your target roles."
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
  const [modelRecommendations, setModelRecommendations] = useState(null);
  const [geminiRecommendations, setGeminiRecommendations] = useState(null);
  const [top3Recommendations, setTop3Recommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [top3Loading, setTop3Loading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [geminiStatus, setGeminiStatus] = useState({
    initialized: false,
    enabled: false,
    message: "Checking Gemini API status..."
  });
  const [modelStatus, setModelStatus] = useState({
    initialized: false,
    enabled: false,
    message: "Job recommendation model not loaded yet"
  });
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showLearningPaths, setShowLearningPaths] = useState({});

  // Initialize TensorFlow model and Gemini on component mount
  useEffect(() => {
    // Initialize the ML model
    const loadModel = async () => {
      const modelLoaded = await initializeJobModel();
      setModelStatus({
        initialized: true,
        enabled: modelLoaded,
        message: modelLoaded 
          ? "Job recommendation model loaded successfully" 
          : "Failed to load job recommendation model"
      });
    };
    
    loadModel();
    
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
    setModelLoading(true);
    setGeminiLoading(true);
    setErrorMsg("");
    setFileName(file.name);
  
    const user = auth.currentUser;
    if (!user) {
      setErrorMsg("User not logged in.");
      setLoading(false);
      setModelLoading(false);
      setGeminiLoading(false);
      return;
    }
  
    try {
      // Extract text from the resume file
      const extractedText = await extractTextFromFile(file);
      setResumeText(extractedText);
      setResumeUploaded(true);
      
      // Get job recommendations from the ML model
      try {
        if (modelStatus.enabled) {
          const mlRecommendations = await getModelRecommendations(extractedText);
          setModelRecommendations(mlRecommendations);
          setModelLoading(false);
          
          // If Gemini is enabled, use it to enhance the recommendations
          if (geminiStatus.enabled) {
            try {
              const aiRecommendations = await getGeminiRecommendations(extractedText, mlRecommendations);
              setGeminiRecommendations(aiRecommendations);
              
              // Save to Firestore
              await setDoc(doc(db, "resumeResults", user.uid), {
                fileName: file.name,
                uploadedAt: new Date().toISOString(),
                modelRecommendations: mlRecommendations,
                geminiRecommendations: aiRecommendations
              });
              
              // Combine model and Gemini recommendations
              setTop3Recommendations(getTop3Recommendations(aiRecommendations, mlRecommendations));
              
            } catch (geminiError) {
              console.error("Gemini processing failed:", geminiError);
              setErrorMsg("Failed to process resume with Gemini. Using model recommendations only.");
              setTop3Recommendations(getTop3Recommendations(null, mlRecommendations));
            }
          } else {
            // If Gemini is not enabled, just use the model recommendations
            setTop3Recommendations(getTop3Recommendations(null, mlRecommendations));
            setGeminiRecommendations({
              jobRecommendations: [],
              aiInsights: "Gemini API key not configured. Please add a valid API key to enable AI-powered learning paths."
            });
          }
        } else {
          throw new Error("Job recommendation model not initialized");
        }
      } catch (modelError) {
        console.error("Model processing failed:", modelError);
        setErrorMsg("Failed to process resume with job recommendation model. Please try again.");
        setModelRecommendations(null);
      }
      
    } catch (err) {
      console.error("Processing failed:", err);
      setErrorMsg("Resume processing failed. Please try again with a different file or format.");
      setResumeUploaded(false);
    } finally {
      setLoading(false);
      setModelLoading(false);
      setGeminiLoading(false);
    }
  };

  const handleGenerateTop3 = async () => {
    setTop3Loading(true);
    setErrorMsg("");
    
    try {
      if (!modelStatus.enabled) {
        setErrorMsg("Cannot generate recommendations. Job recommendation model is not loaded properly.");
        setTop3Loading(false);
        return;
      }
      
      if (resumeText) {
        try {
          // Get recommendations from the model
          const mlRecommendations = await getModelRecommendations(resumeText);
          setModelRecommendations(mlRecommendations);
          
          // If Gemini is enabled, enhance the recommendations
          if (geminiStatus.enabled) {
            try {
              const aiRecommendations = await getGeminiRecommendations(resumeText, mlRecommendations);
              setGeminiRecommendations(aiRecommendations);
              setTop3Recommendations(getTop3Recommendations(aiRecommendations, mlRecommendations));
            } catch (geminiError) {
              console.error("Gemini enhancement failed:", geminiError);
              setTop3Recommendations(getTop3Recommendations(null, mlRecommendations));
            }
          } else {
            setTop3Recommendations(getTop3Recommendations(null, mlRecommendations));
          }
        } catch (modelError) {
          console.error("Model processing failed:", modelError);
          setErrorMsg("Failed to generate recommendations. Please try again later.");
        }
      } else {
        throw new Error("No resume text available");
      }
    } catch (error) {
      console.error("Failed to generate top 3 recommendations:", error);
      setErrorMsg("Failed to generate recommendations. Please try uploading your resume again.");
      
      setTop3Recommendations({
        jobRecommendations: [],
        aiInsights: "Unable to generate recommendations. Please upload a resume first."
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
    setModelRecommendations(null);
    setGeminiRecommendations(null);
    setTop3Recommendations(null);
    setFileName("");

    setFileName("");
    setResumeText("");
    setErrorMsg("");
  };

  // Toggle display of learning paths for a specific job
  const toggleLearningPath = (jobIndex) => {
    setShowLearningPaths(prev => ({
      ...prev,
      [jobIndex]: !prev[jobIndex]
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Resume Analysis</h1>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Model Status */}
          <div className={`p-4 rounded-lg shadow-md ${modelStatus.enabled ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className="text-lg font-semibold mb-2">Job Recommendation Model</h3>
            <p className={`${modelStatus.enabled ? 'text-green-600' : 'text-red-600'}`}>
              {modelStatus.message}
            </p>
          </div>
          
          {/* Gemini Status */}
          <div className={`p-4 rounded-lg shadow-md ${geminiStatus.enabled ? 'bg-green-50' : 'bg-yellow-50'}`}>
            <h3 className="text-lg font-semibold mb-2">Gemini AI Status</h3>
            <p className={`${geminiStatus.enabled ? 'text-green-600' : 'text-yellow-600'}`}>
              {geminiStatus.message}
            </p>
            
            {!geminiStatus.enabled && (
              <div className="mt-2">
                {showApiKeyInput ? (
                  <div className="flex flex-col space-y-2">
                    <input 
                      type="password"
                      placeholder="Enter your Gemini API key"
                      className="p-2 border rounded"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                    />
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSetApiKey}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Set API Key
                      </button>
                      <button 
                        onClick={() => setShowApiKeyInput(false)}
                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowApiKeyInput(true)}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Configure API Key
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Resume Upload Section */}
        {!resumeUploaded ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Your Resume</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleResumeUpload(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer block"
              >
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop your resume
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, or TXT files only</p>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <>
            {/* Resume Uploaded - Show Job Matches */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resume Uploaded: {fileName}</h2>
                <button
                  onClick={handleUpdateResume}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Upload Different Resume
                </button>
              </div>
              
              {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {errorMsg}
                </div>
              )}
              
              {loading && (
                <div className="text-center py-6">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Processing your resume...</p>
                </div>
              )}
              
              {!loading && !top3Recommendations && (
                <div className="text-center py-6">
                  <button
                    onClick={handleGenerateTop3}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                    disabled={top3Loading}
                  >
                    {top3Loading ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                        Generating...
                      </>
                    ) : (
                      "Generate Job Recommendations"
                    )}
                  </button>
                </div>
              )}
              
              {/* Display Top 3 Recommendations */}
              {top3Recommendations && top3Recommendations.jobRecommendations && top3Recommendations.jobRecommendations.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3">Top 3 Job Matches</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {top3Recommendations.jobRecommendations.map((job, index) => (
                      <div 
                        key={index} 
                        className="bg-white border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-800">{job.title}</h4>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                              {job.match} Match
                            </span>
                          </div>
                          
                          <p className="mt-3 text-gray-700">{job.description}</p>
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-800 mb-2">Required Skills:</h5>
                            <div className="flex flex-wrap gap-2">
                              {job.skills && job.skills.map((skill, skillIndex) => (
                                <span 
                                  key={skillIndex}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {job.learningPath && job.learningPath.length > 0 && (
                            <div className="mt-4">
                              <button
                                onClick={() => toggleLearningPath(index)}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <span>{showLearningPaths[index] ? "Hide" : "Show"} Learning Path</span>
                                <svg 
                                  className={`w-4 h-4 ml-1 transform ${showLearningPaths[index] ? 'rotate-180' : ''}`} 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </button>
                              
                              {showLearningPaths[index] && (
                                <div className="mt-3 pl-2 border-l-2 border-blue-200">
                                  <h6 className="font-medium text-gray-800 mb-2">Recommended Courses:</h6>
                                  {job.learningPath.map((course, courseIndex) => (
                                    <div key={courseIndex} className="mb-3 bg-gray-50 p-3 rounded">
                                      <h6 className="font-medium">{course.title}</h6>
                                      <p className="text-sm">Provider: {course.provider}</p>
                                      <p className="text-sm">Difficulty: {course.difficulty}</p>
                                      <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* AI Insights Box */}
                  {top3Recommendations.aiInsights && (
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-blue-800 mb-2">AI Career Insights</h4>
                      <p className="text-gray-700">{top3Recommendations.aiInsights}</p>
                    </div>
                  )}
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleGoToJobs}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                    >
                      Explore More Job Opportunities
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;