// JobRecommendationService.jsx
// This service handles communication with the backend API for job recommendations
const API_BASE_URL = 'http://localhost:5000';
export const JobRecommendationService = {
  /**
   * Upload a resume file and get job recommendations
   * @param {File} file - The resume file to upload (PDF, DOCX, or TXT)
   * @returns {Promise} Promise resolving to job recommendation data
   */
  async getJobRecommendations(file) {
    try {
      const formData = new FormData();
      formData.append('resume_file', file);
      // Log the file being uploaded
      console.log(`Uploading resume file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      const response = await fetch(`${API_BASE_URL}/upload_resume`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - FormData will set the appropriate boundary
      });
      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error getting job recommendations');
        } else {
          // Handle non-JSON error response
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error('Server error. Please try again later.');
        }
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Unexpected response type:', contentType, responseText.substring(0, 100));
        throw new Error('Server returned an unexpected response format');
      }
      const data = await response.json();
      console.log('API response received:', data);
      return data;
    } catch (error) {
      console.error('Error in job recommendation service:', error);
      throw error;
    }
  },
  /**
   * Format resume analysis results from the backend API response
   * @param {Object} apiResponse - Raw API response from backend
   * @returns {Object} Formatted job recommendations data
   */
  formatRecommendationResults(apiResponse) {
    console.log('Formatting recommendation results:', apiResponse);
    
    // If we already have formatted recommendations from the backend, use those
    if (apiResponse.formatted_recommendations) {
      console.log('Using pre-formatted recommendations from backend');
      return apiResponse.formatted_recommendations;
    }
    // Check if we have recommendations from the API
    if (!apiResponse || !apiResponse.recommendations || apiResponse.recommendations.length === 0) {
      console.warn('No recommendations found in API response');
      return {
        jobRecommendations: [],
        aiInsights: "Unable to generate recommendations from your resume."
      };
    }
    
    // Extract skills if available from the API
    const extractedSkills = apiResponse.extracted_skills || [];
    
    // Map job titles to relevant industry skills that might be missing
    const missingSkillsMapping = {
      "Data Scientist": ["TensorFlow", "Big Data", "Cloud Platforms", "Deep Learning", "NLP"],
      "Software Engineer": ["Kubernetes", "AWS", "CI/CD", "Microservices", "GraphQL"],
      "Product Manager": ["Data Analysis", "Technical Knowledge", "Agile Certification", "Product Metrics"],
      "UX Designer": ["Motion Design", "Design Systems", "Frontend Coding", "User Research"],
      "DevOps Engineer": ["Kubernetes", "Terraform", "Cloud Architecture", "Security Automation"],
      "Chef": ["Advanced Pastry", "International Cuisine", "Nutrition Science", "Menu Costing"],
      "Pastry Chef": ["Advanced Baking", "Dessert Plating", "Sugar Crafting", "Chocolate Tempering"],
      "Executive Chef": ["Menu Engineering", "Culinary Leadership", "Kitchen Operations", "Cost Control"],
      "Sous Chef": ["Team Management", "Recipe Execution", "Kitchen Coordination", "Food Preparation"],
      "Garde Manger Chef": ["Cold Dish Preparation", "Appetizer Crafting", "Charcuterie Techniques", "Food Styling"],
      "Private Chef": ["Custom Meal Planning", "Exclusive Dining", "Dietary Adaptation", "Personalized Recipes"],
      "Nutritionist Chef": ["Healthy Cooking", "Balanced Meals", "Diet Planning", "Nutritional Science"],
      "Cruise Ship Chef": ["International Cuisine", "Buffet Management", "High-Volume Cooking", "Hospitality Operations"],
      "Consultant Chef": ["Culinary Consulting", "Menu Optimization", "Restaurant Efficiency", "Food Innovation"],
      "Saucier Chef": ["Sauce Creation", "Flavor Reduction", "Garnishing Techniques", "Culinary Infusion"],
      "Marketing Manager": ["SEO", "Content Marketing", "Marketing Automation", "Analytics"],
      "Sales Representative": ["Advanced Sales Techniques", "Industry Certifications", "Data Analysis"],
      "Project Manager": ["Agile Methodologies", "Resource Optimization", "Strategic Planning"],
      "Financial Analyst": ["Financial Modeling", "SAP", "Forecasting", "Data Visualization"],
      "Accountant": ["CPA Certification", "ERP Systems", "Advanced Excel", "Financial Modeling"],
      "Legal Counsel": ["Specialized Law Practice", "Negotiation", "Legal Tech Tools", "Dispute Resolution"],
      "Agricultural Manager": ["Precision Agriculture", "AgriTech", "Sustainable Practices", "Supply Chain Management"],
      "Fashion Designer": ["Sustainable Fashion", "3D Modeling", "Supply Chain", "E-commerce Integration"],
      "Graphic Designer": ["Creative Direction", "Advanced Typography", "Marketing Strategy", "Data Visualization"],
      "Interior Designer": ["Structural Design", "Real Estate Development", "Advanced CAD", "Building Codes"],
      "UX Designer": ["Psychological Research", "AI Integration", "Voice UI Design", "Data Analytics"],
      "Industrial Designer": ["Mechanical Engineering", "Material Chemistry", "Robotics Design", "Manufacturing Logistics"],
      "Game Designer": ["AI Scripting", "3D Physics", "Advanced Animation", "Virtual Reality Development"],
      "Web Designer": ["Cybersecurity", "Advanced JavaScript", "Database Management", "SEO Analytics"],
      "Floral Designer": ["Advanced Flower Preservation", "Luxury Floral Branding", "Digital Floral Marketing", 
        "3D Floral Sculpting", "Sustainable Floristry", "Business Management for Florists", "Wholesale Flower Sourcing", 
        "Event Coordination", "Creative Concept Development", "Cross-disciplinary Design Integration", "AI-driven Floral Customization"],
        "Floral Designer": ["Advanced Flower Preservation", "Luxury Floral Branding", "Digital Floral Marketing", 
        "3D Floral Sculpting", "Sustainable Floristry", "Business Management for Florists", "Wholesale Flower Sourcing", 
        "Event Coordination", "Creative Concept Development", "Cross-disciplinary Design Integration", "AI-driven Floral Customization"],
        "Tax Accountant": ["International Taxation", "Tax Law Interpretation", "Advanced Tax Strategy", "Cryptocurrency Tax Compliance"],
        "Auditor": ["IT Auditing", "Cybersecurity Risk Assessment", "AI-driven Fraud Detection", "Government Regulatory Compliance"],
        "Forensic Accountant": ["Blockchain Forensics", "Digital Financial Crime Investigation", "Legal Litigation Support", "Financial Profiling"],
        "Financial Accountant": ["Integrated Reporting", "Financial Risk Management", "Predictive Analytics", "Advanced ERP Systems"],
        "Cost Accountant": ["Lean Accounting", "Activity-Based Costing", "Advanced Budget Modeling", "Strategic Cost Reduction"],
        "Management Accountant": ["Corporate Governance", "Behavioral Economics in Finance", "Leadership in Accounting", "Business Intelligence Tools"],
        "Payroll Accountant": ["Payroll Tax Strategy", "HR Finance Integration", "Employee Compensation Analytics", "Automated Payroll Systems"],
        "Government Accountant": ["Public Finance Transparency", "Federal Grant Reporting", "Municipal Finance Regulations", "Government Cost Allocation"],
        "Investment Accountant": ["Portfolio Risk Analysis", "Hedge Fund Valuation", "Cryptocurrency Investment Accounting", "Global Securities Accounting"],
        "CPA (Certified Public Accountant)": ["Advanced Advisory Services", "Public Trust Management", "Ethical Accounting Standards", "Cross-border Financial Regulations"]
    };
    
    // Map job titles to fictional companies
    const companyMapping = {
      "Data Scientist": "Analytics Co.",
      "Software Engineer": "Tech Innovations",
      "Product Manager": "Product Innovations Inc.",
      "UX Designer": "Creative Designs Inc.",
      "DevOps Engineer": "Cloud Systems Inc.",
      "Chef": "Culinary Innovations",
      "Pastry Chef": "Le Cordon Bleu",
      "Executive Chef": "The Ritz-Carlton",
      "Sous Chef": "The Savoy",
      "Garde Manger Chef": ["Hotel Banquets, ", "Cruise Line Dining"],
      "Private Chef": ["Celebrity Residences, ", "Private Estates"],
      "Nutritionist Chef": ["Hospitals, ", "Wellness Resorts"],
      "Cruise Ship Chef": ["Royal Caribbean, ", "Carnival Cruise Line"],
      "Consultant Chef": ["Restaurant Consulting Firms, ", "Hospitality Groups"],
      "Saucier Chef": ["French Restaurants, ", "Steakhouses"],
      "Marketing Manager": "Growth Strategies Inc.",
      "Sales Representative": "Sales Experts Ltd.",
      "Project Manager": "Enterprise Solutions",
      "Financial Analyst": "Capital Management",
      "Accountant": "Financial Solutions",
      "Legal Counsel": "Corporate Legal Partners",
      "Agricultural Manager": "FarmTech Solutions",
      "Fashion Designer": "Trendsetter Apparel",
      "Graphic Designer": ["Adobe, ", "Canva"],
      "Interior Designer": ["IKEA, ", "Gensler"],
      "UX Designer": ["Google, ", "Meta, ", "Microsoft, ", "Apple, ", "Amazon, ", "IBM, ", "Figma, ", "Adobe XD, ", "Spotify, ", "Salesforce"],
      "Industrial Designer": ["Tesla, ", "IDEO"],
      "Game Designer": ["Nintendo, ", "Ubisoft"],
      "Floral Designer": "Farmgirl Flowers",
      "Web Designer": ["Wix, ", "Squarespace, ", "WordPress, ", "Shopify, ", "Google"],
      "Tax Accountant": ["Deloitte"],
        "Auditor": ["PwC (PricewaterhouseCoopers)"],
        "Forensic Accountant": ["Kroll"],
        "Financial Accountant": ["EY (Ernst & Young)"],
        "Cost Accountant": ["Caterpillar Inc."],
        "Management Accountant": ["IBM"],
        "Payroll Accountant": ["ADP"],
        "Government Accountant": ["U.S. Department of the Treasury"],
        "Investment Accountant": ["BlackRock"],
        "CPA (Certified Public Accountant)": ["AICPA (American Institute of CPAs)"],
    };
    
    // Format job recommendations
    const jobRecommendations = apiResponse.recommendations.map((job, index) => {
      const jobTitle = job.job_title;
      const matchPercent = Math.round(job.confidence * 100);
      const company = companyMapping[jobTitle] || `Company ${index + 1}`;
      
      // Get matched skills for this job
      const matchingSkills = job.matching_skills || [];
      
      // Format skills for display - capitalize first letter
      const formattedSkills = matchingSkills.map(skill => 
        skill.charAt(0).toUpperCase() + skill.slice(1)
      );
      
      // If we have fewer than 2 skills, add some generic ones
      const displaySkills = formattedSkills.length >= 2 ? 
        formattedSkills.slice(0, 4) : 
        [...formattedSkills, "Communication", "Problem Solving"].slice(0, 4);
      
      // Get missing skills for this job title
      const missingSkills = missingSkillsMapping[jobTitle] || 
        ["Leadership", "Advanced Technical Skills", "Project Management"];
      
      return {
        title: jobTitle,
        company: company,
        match: `${matchPercent}% Match`,
        description: `This role matches your resume profile and skills.`,
        skills: displaySkills,
        learningPath: [
          {
            title: `Advanced ${missingSkills[0]} Course`,
            provider: "Professional Learning Center",
            difficulty: "Intermediate",
            description: "Enhance your career prospects with this essential skill."
          },
          {
            title: `${jobTitle} Certification`,
            provider: "Industry Academy",
            difficulty: "Advanced",
            description: "Get certified in key technologies for this role."
          }
        ]
      };
    });
    
    // Generate AI insights
    let aiInsights = "";
    if (jobRecommendations.length > 0 && extractedSkills.length > 0) {
      const topJob = jobRecommendations[0];
      const topSkills = topJob.skills.slice(0, 3);
      
      // Get missing skills for top job
      const missingSkills = missingSkillsMapping[topJob.title] || 
        ["Leadership", "Advanced Technical Skills", "Project Management"];
      const topMissingSkills = missingSkills.slice(0, 3);
      
      aiInsights = `Based on your resume, you have a strong foundation in ${topSkills.join(', ')}. ` +
        `To increase your prospects as a ${topJob.title}, consider developing skills in ${topMissingSkills.join(', ')}.`;
    } else {
      aiInsights = "Based on your resume, consider developing additional technical and soft skills to improve your job prospects.";
    }
    
    return {
      jobRecommendations,
      aiInsights
    };
  },
  
  /**
   * Parse and extract skills from resume text
   * @param {string} resumeText - Raw text extracted from resume
   * @returns {Array} Array of identified skills
   */
  extractSkillsFromText(resumeText) {
    if (!resumeText) return [];
    
    // Common skills to look for across different job categories
    const commonSkills = [
      // Technical skills
      "python", "java", "javascript", "sql", "aws", "docker", "kubernetes", "git", "react", 
      "angular", "node", "c++", "c#", "php", "ruby", "scala", "r", "matlab", 
      
      // Data science
      "machine learning", "data analysis", "data visualization", "statistics", "tensorflow",
      "pandas", "numpy", "sklearn", "ai", "deep learning", "nlp", "tableau", "power bi",
      
      // Design
      "ui", "ux", "figma", "sketch", "adobe", "design thinking", "wireframe", "prototype",
      
      // Project management
      "agile", "scrum", "project management", "jira", "kanban", "pmp",
      
      // Business
      "marketing", "sales", "strategy", "business development", "product management",
      
      // Finance
      "financial analysis", "accounting", "budgeting", "forecasting"
    ];
    
    const lowerText = resumeText.toLowerCase();
    const extractedSkills = new Set();
    
    // Extract multi-word skills first
    commonSkills
      .filter(skill => skill.includes(' '))
      .forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
          extractedSkills.add(skill);
        }
      });
    
    // Then extract single-word skills with word boundaries
    commonSkills
      .filter(skill => !skill.includes(' '))
      .forEach(skill => {
        const regex = new RegExp('\\b' + skill.toLowerCase() + '\\b', 'i');
        if (regex.test(lowerText)) {
          extractedSkills.add(skill);
        }
      });
    
    return Array.from(extractedSkills);
  },
  
  /**
   * Get educational resources for career development
   * @param {string} jobTitle - The job title to get resources for
   * @returns {Array} Array of learning resources
   */
  getLearningResources(jobTitle) {
    const resourceMapping = {
      "Data Scientist": [
        { title: "Machine Learning Specialization", provider: "Coursera", level: "Intermediate" },
        { title: "Deep Learning Mastery", provider: "edX", level: "Advanced" },
        { title: "Python for Data Analysis", provider: "DataCamp", level: "Beginner" }
      ],
      "Software Engineer": [
        { title: "Full Stack Web Development", provider: "Udemy", level: "Intermediate" },
        { title: "Cloud Architecture Certification", provider: "AWS", level: "Advanced" },
        { title: "Modern JavaScript", provider: "Frontend Masters", level: "Beginner" }
      ],
      "Product Manager": [
        { title: "Product Management Essentials", provider: "Product School", level: "Intermediate" },
        { title: "Agile Methodologies", provider: "Scrum.org", level: "Beginner" },
        { title: "Data-Driven Product Strategy", provider: "O'Reilly", level: "Advanced" }
      ]
    };
    
    // Return specific resources for the job or default resources
    return resourceMapping[jobTitle] || [
      { title: "Professional Development Course", provider: "LinkedIn Learning", level: "Intermediate" },
      { title: "Leadership Essentials", provider: "MasterClass", level: "Beginner" },
      { title: "Industry Certification", provider: "Professional Academy", level: "Advanced" }
    ];
  },
  
  /**
   * Generate a formatted resume summary
   * @param {string} resumeText - Raw text extracted from resume
   * @returns {Object} Formatted resume summary
   */
  generateResumeSummary(resumeText) {
    if (!resumeText || resumeText.trim().length === 0) {
      return {
        wordCount: 0,
        keywordDensity: {},
        topSections: []
      };
    }
    
    // Count words
    const words = resumeText.match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    
    // Calculate keyword density (simplified)
    const keywordCounts = {};
    words.forEach(word => {
      if (word.length > 3) {  // Only count words longer than 3 characters
        const lowerWord = word.toLowerCase();
        keywordCounts[lowerWord] = (keywordCounts[lowerWord] || 0) + 1;
      }
    });
    
    // Sort keywords by frequency
    const sortedKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    // Try to identify resume sections (simplified approach)
    const sectionRegex = /\b(EDUCATION|EXPERIENCE|SKILLS|PROJECTS|PUBLICATIONS|CERTIFICATIONS|SUMMARY|OBJECTIVE)\b/gi;
    const sectionMatches = [...resumeText.matchAll(sectionRegex)];
    const sections = sectionMatches.map(match => match[0]);
    
    return {
      wordCount,
      keywordDensity: sortedKeywords,
      topSections: Array.from(new Set(sections)) // Remove duplicates
    };
  }
};