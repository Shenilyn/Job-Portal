import os
import numpy as np
import pickle
import json
import pdfplumber
import docx
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
import re


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
app.config['UPLOAD_FOLDER'] = 'uploads'
CORS(app)  # Enable CORS for all routes
class JobRecommendationSystem:
    def __init__(self, model_path="job_recommendation_model.pkl", vectorizer_path="vectorizer.pkl", 
                 job_mapping_path="job_titles.json"):
        """Initialize the Job Recommendation System."""
        self.use_fallback = False
        
        # Try to load the model
        try:
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                print(f"Model loaded successfully from {model_path}")
            else:
                print(f"Model file not found: {model_path}. Creating new model.")
                self.model = self._create_default_model()
                # Save the new model
                with open(model_path, 'wb') as f:
                    pickle.dump(self.model, f)
                print(f"New model created and saved to {model_path}")
        except Exception as e:
            print(f"Error with model: {e}")
            print("Creating new model instead...")
            self.model = self._create_default_model()
            # Try to save the new model
            try:
                with open(model_path, 'wb') as f:
                    pickle.dump(self.model, f)
                print(f"New model saved to {model_path}")
            except Exception as save_e:
                print(f"Couldn't save new model: {save_e}")

        # Try to load the vectorizer
        try:
            if os.path.exists(vectorizer_path):
                with open(vectorizer_path, "rb") as f:
                    self.vectorizer = pickle.load(f)
                print(f"Vectorizer loaded successfully from {vectorizer_path}")
            else:
                print(f"Vectorizer file not found: {vectorizer_path}. Creating new vectorizer.")
                self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
                # Since a new vectorizer needs training data, make sure it's fit on some sample data
                sample_data = ["Sample resume text for software development and programming",
                              "Sample resume for data science with machine learning experience",
                              "Sample resume for management and leadership positions"]
                self.vectorizer.fit(sample_data)
                # Save the new vectorizer
                with open(vectorizer_path, 'wb') as f:
                    pickle.dump(self.vectorizer, f)
                print(f"New vectorizer created and saved to {vectorizer_path}")
        except Exception as e:
            print(f"Error with vectorizer: {e}")
            print("Creating new vectorizer instead...")
            self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
            # Fit on sample data
            sample_data = ["Sample resume text for software development and programming",
                          "Sample resume for data science with machine learning experience",
                          "Sample resume for management and leadership positions"]
            self.vectorizer.fit(sample_data)
            # Try to save the new vectorizer
            try:
                with open(vectorizer_path, 'wb') as f:
                    pickle.dump(self.vectorizer, f)
                print(f"New vectorizer saved to {vectorizer_path}")
            except Exception as save_e:
                print(f"Couldn't save new vectorizer: {save_e}")
            
        # Load or create job title mapping - expanded with additional job categories from JS code
        try:
            if os.path.exists(job_mapping_path):
                with open(job_mapping_path, "r") as f:
                    self.job_titles = json.load(f)
                print(f"Job titles loaded from {job_mapping_path}")
            else:
                self.job_titles = {
                    "0": "Data Scientist",
                    "1": "Software Engineer",
                    "2": "Product Manager",
                    "3": "UX Designer",
                    "4": "DevOps Engineer",
                    "5": "Chef",
                    "6": "Marketing Manager",
                    "7": "Sales Representative",
                    "8": "Project Manager", 
                    "9": "Financial Analyst",
                    "10": "Accountant",
                    "11": "Legal Counsel",
                    "12": "Agricultural Manager",
                    "13": "Fashion Designer"
                }
                with open(job_mapping_path, "w") as f:
                    json.dump(self.job_titles, f, indent=2)
                print(f"Default job titles created and saved to {job_mapping_path}")
        except Exception as e:
            print(f"Error with job titles: {e}")
            self.job_titles = {
                "0": "Data Scientist",
                "1": "Software Engineer",
                "2": "Product Manager",
                "3": "UX Designer",
                "4": "DevOps Engineer",
                "5": "Chef",
                "6": "Marketing Manager",
                "7": "Sales Representative",
                "8": "Project Manager",
                "9": "Financial Analyst",
                "10": "Accountant",
                "11": "Legal Counsel",
                "12": "Agricultural Manager",
                "13": "Fashion Designer",
                "14": "Pastry Chef",
                "15": "Executive Chef",
                "16": "Sous Chef",
                "17": "Garde Manger Chef",
                "18": "Private Chef",
                "19": "Nutritionist Chef",
                "20": "Cruise Ship Chef",
                "21": "Consultant Chef",
                "22": "Saucier Chef",
                "23": "Graphic Designer",
                "24": "Interior Designer",
                "25": "Industrial Designer",
                "26": "Game Designer",
                "27": "Web Designer",
                "28": "Floral Designer",
                "29": "Tax Accountant",
                "30": "Auditor",
                "31": "Forensic Accountant",
                "32": "Financial Accountant",
                "33": "Cost Accountant",
                "34": "Management Accountant",
                "35": "Payroll Accountant",
                "36": "Government Accountant",
                "37": "Investment Accountant",
                "38": "CPA (Certified Public Accountant)"
            }
            print("Using default job titles without saving")
            
        # Initialize skill dictionaries
        self._initialize_skill_mappings()

    def _initialize_skill_mappings(self):
        """Initialize the skill mappings for job categories"""
        # Define skills for each job title
        self.job_skills = {
            "Data Scientist": ["python", "sql", "data visualization", "statistics", "analytics", 
                              "data analysis", "pandas", "numpy", "sklearn", "tensorflow", "visualization", 
                              "jupyter", "ai", "artificial intelligence", "algorithms", "statistical", 
                              "big data", "data mining", "database", "deep learning", "nlp", "tableau",
                              "power bi", "machine learning", "r", "spss", "matlab", "data science"],
                              
            "Software Engineer": ["software", "programming", "development", "java", "python", "javascript", 
                                 "code", "algorithm", "api", "web", "full stack", "backend", "frontend", 
                                 "app", "mobile", "cloud", "github", "git", "debugging", "testing", "agile", 
                                 "software design", "object oriented", "oop", "react", "angular", "node",
                                 "c++", "c#", "php", ".net", "ruby", "scala", "rust", "go", "azure", "aws",
                                 "devops", "microservices", "rest api", "graphql"],
                                 
            "Product Manager": ["product", "management", "strategy", "roadmap", "agile", "scrum", "user experience", 
                               "prioritization", "stakeholder", "business", "customer", "market research", 
                               "feature", "specification", "project management", "competitive analysis", 
                               "product development", "launch", "requirements", "backlog", "jira",
                               "product owner", "mvp", "user stories", "product vision", "a/b testing",
                               "product metrics", "okrs", "sprint planning", "user feedback", "product lifecycle"],
                               
            "UX Designer": ["design", "user experience", "ux", "ui", "wireframe", "prototype", "usability", 
                          "sketch", "figma", "adobe", "visual design", "interaction", "user research", 
                          "interface", "accessibility", "information architecture", "design thinking", 
                          "user testing", "storyboard", "persona", "user journey", "creative", "adobe xd",
                          "invision", "zeplin", "typography", "color theory", "user interface", "responsive design"],
                          
            "DevOps Engineer": ["devops", "ci/cd", "pipeline", "aws", "cloud", "docker", "kubernetes", 
                               "infrastructure", "linux", "automation", "jenkins", "terraform", "ansible", 
                               "monitoring", "deployment", "configuration", "security", "networking", 
                               "containers", "microservices", "git", "continuous integration", "azure", "gcp",
                               "prometheus", "grafana", "puppet", "chef", "bash", "scripting", "nginx", "apache"],
                               
            "Chef": ["culinary", "cooking", "chef", "kitchen", "food", "recipe", "cuisine", "baking", 
                    "pastry", "catering", "restaurant", "menu", "sous chef", "head chef", "executive chef", 
                    "food preparation", "gastronomy", "hospitality", "nutrition", "food safety", "culinary arts", 
                    "buffet", "food service", "meal planning", "fine dining", "saute", "grill", "taste", 
                    "flavor", "ingredients", "dietary", "butchery", "garde manger", "banquet"],

            "Pastry Chef": ["desserts", "baking", "patisserie", "confectionery", "sweet treats", "pastry arts", "cake decorating", 
                            "fondant", "ganache", "whisking", "meringue", "custard", "glazing", "sugar work", "chocolate tempering", 
                            "artisan baking", "viennoiserie", "bread-making", "laminate dough", "torte", "proofing", "buttercream", 
                            "caramelization", "flavor pairing", "plating", "food styling", "pastry techniques", "garde manger", 
                            "dough preparation", "buffet", "banquet", "hospitality", "culinary arts", "food service", "meal planning", 
                            "fine dining", "ingredients", "nutrition", "food safety", "gastronomy", "menu creation", 
                            "executive pastry chef"],

            "Executive Chef": ["menu creation", "kitchen management", "restaurant operations", "culinary leadership", "food safety", 
                               "staff training", "inventory control", "cost management", "fine dining", "gastronomy"],

            "SOUS Chef": ["food preparation", "team supervision", "kitchen coordination", "recipe execution", "menu development", 
                          "culinary techniques", "restaurant service", "flavor balancing"],

            "Garde Manger Chef": ["cold dishes", "appetizers", "charcuterie", "salads", "plating", "buffet", "banquet", "food styling", 
                                  " food presentation", "flavor pairing"],

            "Saucier Chef": ["sauces", "stocks", "braising", "saute", "reduction", "flavor infusion", "garnishing", "culinary techniques"],

            "Private Chef": ["custom meal planning", "exclusive dining", "nutrition", "dietary cooking", "personalized recipes", "high-end dining", 
                             "seasonal ingredients"],

            "Nutritionist Chef": ["healthy cooking", "diet planning", "balanced meals", "nutritional science"],

            "Cruise Ship Chef": ["international cuisine", "buffet service", "high-volume cooking", "cruise hospitality"],

            "Consultant Chef": ["culinary consulting", "menu optimization", "restaurant efficiency", "food innovation", "business development"],

            "Marketing Manager": ["marketing", "strategy", "brand", "social media", "market research", 
                                 "campaigns", "digital marketing", "marketing strategy", "customer relations", 
                                 "analytics", "advertising", "seo", "content marketing", "marketing automation",
                                 "branding", "marketing campaign", "email marketing", "lead generation", 
                                 "content strategy", "marketing analytics", "google analytics", "ppc", "sem", 
                                 "cro", "copywriting", "marketing communications", "public relations"],
                                 
            "Sales Representative": ["sales", "business development", "customer acquisition", "account management", 
                                    "negotiation", "client relations", "pipeline", "crm", "quotas", "leads", 
                                    "prospecting", "sales strategy", "b2b", "b2c", "relationship management",
                                    "sales funnel", "closing deals", "sales pitch", "cold calling", "salesforce",
                                    "sales forecasting", "territory management", "customer success", "solution selling", 
                                    "consultative selling", "sales presentations"],
                                    
            "Project Manager": ["project management", "team leadership", "project planning", "stakeholder management", 
                               "budgeting", "agile", "scrum", "waterfall", "project delivery", "resource management", 
                               "timelines", "risk management", "pmp", "strategic planning", "jira", "ms project",
                               "project coordination", "change management", "project scheduling", "project documentation",
                               "requirements gathering", "issue tracking", "critical path", "status reporting",
                               "project lifecycle", "kanban", "sprint planning"],
                               
            "Financial Analyst": ["financial analysis", "excel", "finance", "accounting", "reporting", "financial modeling", 
                                 "forecasting", "budgeting", "investment", "valuation", "financial statements", 
                                 "business analysis", "sap", "financial planning", "data analysis", "balance sheet",
                                 "income statement", "cash flow", "variance analysis", "profitability analysis",
                                 "p&l", "kpi reporting", "financial metrics", "equity research", "business intelligence"],
                                 
            "Accountant": ["accounting", "bookkeeping", "financial reporting", "tax preparation", "quickbooks", 
                          "auditing", "cpa", "general ledger", "accounts payable", "accounts receivable", 
                          "reconciliation", "balance sheet", "income statement", "financial statements", "erp systems",
                          "tax returns", "gaap", "fixed assets", "accruals", "journal entries", "month-end close",
                          "payroll processing", "cash management", "cost accounting", "financial controls"],

            "Tax Accountant": ["tax preparation", "tax compliance", "IRS regulations", "tax returns", "income tax", 
                               "corporate tax", "sales tax", "tax deductions", "audit defense", "tax laws", "estate tax", 
                               "financial statements", "GAAP", "tax strategy", "cost accounting"],

            "Auditor": ["auditing", "internal controls", "financial compliance", "risk assessment", "forensic accounting", 
                        "fraud detection", "regulatory reporting", "audit procedures", "GAAP", "financial statements", 
                        "Sarbanes-Oxley", "account reconciliations"],

            "Forensic Accountant": ["forensic accounting", "fraud investigation", "financial crime", "money laundering", 
                                    "litigation support", "criminal investigations", "internal controls", "audit trails", 
                                    "business valuation", "compliance auditing"],

            "Financial Accountant": ["financial reporting", "balance sheet", "income statement", "GAAP", "IFRS", "general ledger", 
                                     "financial analysis", "accounting software", "ERP systems", "financial controls", 
                                     "month-end close", "fixed assets", "journal entries"],

            "Cost Accountant": ["cost accounting", "budgeting", "variance analysis", "manufacturing costs", "profitability analysis", 
                                "inventory valuation", "activity-based costing", "cost estimation", "financial forecasting", 
                                "management accounting"],

            "Management Accountant": ["financial planning", "strategic budgeting", "corporate finance", "cost analysis", 
                                      "performance evaluation", "business strategy", "cash flow management", "profit and loss analysis", 
                                      "investment analysis", "decision support"],

            "Payroll Accountant": ["payroll processing", "salary calculations", "tax withholding", "employee benefits", 
                                   "payroll compliance", "wage laws", "HR accounting", "tax filings", "account reconciliation", 
                                   "cash management"],

            "Government Accountant": ["public finance", "government budgeting", "federal accounting", "state financial regulations", 
                                      "tax compliance", "grant accounting", "fund accounting", "GAO audits", "government contracts", 
                                      "public sector finance"],

            "Investment Accountant": ["investment reporting", "portfolio accounting", "financial instruments", "stock valuation", 
                                      "hedge fund accounting", "risk assessment", "cash management", "bond accounting", 
                                      "equity analysis", "fund administration"],

            "CPA (Certified Public Accountant)": ["certification", "public accounting", "audit experience", "GAAP compliance", 
                                                  "tax advising", "financial analysis", "consulting", "industry regulations", 
                                                  "client accounting", "business finance"],
                          
            "Legal Counsel": ["legal", "law", "lawyer", "attorney", "legal research", "contract review", 
                             "client consultation", "case management", "dispute resolution", "negotiation", 
                             "legal compliance", "regulatory", "intellectual property", "litigation", "legal advice",
                             "contracts", "legal documents", "legal analysis", "legal writing", "briefs", "counseling",
                             "corporate law", "legal risk", "legal proceedings", "legal strategy"],
                             
            "Agricultural Manager": ["agriculture", "farming", "crop management", "agricultural operations", 
                                    "soil science", "farm equipment", "livestock", "agronomy", "harvest", 
                                    "irrigation", "sustainable farming", "agricultural research", "precision agriculture",
                                    "cultivation", "fertilizer", "pesticides", "farm management", "agricultural economics",
                                    "crop rotation", "farm equipment", "animal husbandry", "organic farming"],
                                    
            "Fashion Designer": ["fashion", "design", "apparel", "garment", "textile", "cad", "trend analysis", 
                                "clothing", "collection", "fashion industry", "pattern making", "sketching", 
                                "sustainable fashion", "product development", "merchandising", "sewing",
                                "fashion trends", "fashion marketing", "couture", "retail", "fashion illustration",
                                "textiles", "fabric selection", "color coordination", "fashion shows"],

            "Graphic Designer": ["visual design", "branding", "typography", "illustration", "logo design", 
                                 "layout", "vector art", "color theory", "digital media", "adobe creative suite", 
                                 "print design", "UI/UX", "composition", "marketing design", "packaging", "infographics", 
                                 "motion graphics", "web design", "photo editing"],

            "Interior Designer": ["space planning", "aesthetics", "home decor", "furniture design", "lighting", "color theory", 
                                  "architecture", "floor planning", "sustainable design", "CAD", "3D modeling", "materials selection", 
                                  "design psychology", "functional spaces", "renovation", "real estate styling", "commercial interiors"],

            "UX Designer": ["user experience", "wireframing", "prototyping", "interaction design", "usability testing", "design thinking", 
                            "Figma", "Adobe XD", "UI components", "mobile design", "responsive design", "human-centered design", 
                            "information architecture", "accessibility", "web design", "app development", "navigation design"],

            "Industrial Designer": ["product design", "ergonomics", "prototyping", "materials science", "manufacturing processes", 
                                    "CAD", "engineering aesthetics", "branding", "mechanical design", "3D rendering", 
                                    "sustainable production", "concept development", "usability testing", "consumer products", 
                                    "innovation", "design research"],

            "Game Designer": ["game mechanics", "level design", "storyboarding", "interactive storytelling", "UI/UX for gaming", 
                              "character design", "animation", "game engines", "3D modeling", "physics simulations", "world-building", 
                              "game testing", "sound design", "narrative development", "virtual environments", "art direction"],

            "Web Designer": ["HTML", "CSS", "JavaScript", "responsive design", "user interface", "CMS", "SEO optimization", 
                             "front-end development", "wireframing", "animation", "color palettes", "page layout", "typography", 
                             "e-commerce design", "branding", "digital marketing", "web performance"],

            "Floral Designer": ["floral design", "flower arrangement", "bouquet crafting", "wedding florals", "event styling", 
                                "botanical artistry", "color theory", "seasonal flowers", "plant care", "garden aesthetics", 
                                "centerpieces", "floral foam", "horticulture", "flower preservation", "floral installations", 
                                "floral retail", "floral trends", "sustainable floristry", "bridal bouquets", "corporate floral design", 
                                "floral sculpture", "greenery styling", "custom arrangements", "flower markets", "indoor plants"]
        }
        
        # Define missing skills for each job title
        self.missing_skills_mapping = {
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
        }
        
        # Define companies for each job title
        self.company_mapping = {
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
        }

    def _create_default_model(self):
        """Create a default model when the saved model can't be loaded"""
        # Create a simple RandomForestClassifier as default
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # Fit model with minimal sample data so it can make predictions
        sample_features = np.random.rand(5, 10)  # 5 samples, 10 features
        sample_labels = np.random.randint(0, len(self.job_titles) if hasattr(self, 'job_titles') else 14, size=5)
        model.fit(sample_features, sample_labels)
        
        return model

    def extract_text_from_resume(self, file_path):
        """Extract text from PDF, DOCX or TXT resume files."""
        if not os.path.exists(file_path):
            print(f"Resume file not found: {file_path}")
            return ""
            
        try:
            if file_path.lower().endswith(".pdf"):
                print(f"Extracting text from PDF: {file_path}")
                with pdfplumber.open(file_path) as pdf:
                    text = "\n".join(page.extract_text() or "" for page in pdf.pages)
                    if not text.strip():
                        print("Warning: PDF text extraction returned empty content")
                    return text
                    
            elif file_path.lower().endswith(".docx"):
                print(f"Extracting text from DOCX: {file_path}")
                doc = docx.Document(file_path)
                return "\n".join(paragraph.text for paragraph in doc.paragraphs)
                
            elif file_path.lower().endswith(".txt"):
                print(f"Reading text file: {file_path}")
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
            else:
                print("Unsupported file format. Only .pdf, .docx, and .txt are supported.")
                return ""
        except Exception as e:
            print(f"Error extracting text from {file_path}: {e}")
            return ""

    def extract_skills_from_resume(self, resume_text):
        """Extract skills from resume text using the job skills dictionary"""
        resume_text = resume_text.lower()
        extracted_skills = set()
        
        # First pass: Look for exact matches of multi-word skills
        for job_title, skills in self.job_skills.items():
            for skill in skills:
                if len(skill.split()) > 1:  # Only check multi-word skills
                    if skill.lower() in resume_text:
                        extracted_skills.add(skill)
                        
        # Second pass: Look for single word skills with word boundaries
        for job_title, skills in self.job_skills.items():
            for skill in skills:
                if len(skill.split()) == 1:  # Only check single-word skills
                    # Use regex word boundary to avoid partial matches
                    if re.search(r'\b' + re.escape(skill.lower()) + r'\b', resume_text):
                        extracted_skills.add(skill)
        
        return list(extracted_skills)

    def get_recommendations(self, resume_file_path):
        """Process resume and get job recommendations"""
        print(f"Processing resume: {resume_file_path}")
        
        resume_text = self.extract_text_from_resume(resume_file_path)
        
        if not resume_text:
            print("Failed to extract text from resume!")
            return {"error": "Failed to extract text from resume"}
        
        print(f"Extracted {len(resume_text)} characters from resume")
        
        # Extract skills from resume
        extracted_skills = self.extract_skills_from_resume(resume_text)
        print(f"Extracted skills: {extracted_skills}")
        
        # Always use our improved keyword-based matching using the extracted text
        keyword_recommendations = self.get_improved_keyword_recommendations(resume_text, extracted_skills)
        
        # Format recommendations with the extracted skills
        formatted_recommendations = self.format_recommendations_with_skills(
            resume_text=resume_text,
            filename=os.path.basename(resume_file_path),
            recommendations=keyword_recommendations["recommendations"],
            extracted_skills=extracted_skills
        )
        
        # Return full results including formatted recommendations
        return {
            "resume_text": resume_text,
            "extracted_skills": extracted_skills,
            "recommendations": keyword_recommendations["recommendations"],
            "formatted_recommendations": formatted_recommendations
        }
    
    def get_improved_keyword_recommendations(self, resume_text, extracted_skills):
        """Improved keyword analysis for job matching using extracted resume text and skills"""
        print("Starting improved keyword recommendations analysis...")
        
        # Initialize job scores dictionary
        job_scores = {}
        resume_text_lower = resume_text.lower()
        
        # Score each job category based on the extracted skills
        for job_title, job_skills in self.job_skills.items():
            # Start with a base score of 0
            job_scores[job_title] = 0
            
            # Score based on extracted skills matching job skills
            relevant_skills = []
            for skill in extracted_skills:
                if skill.lower() in (s.lower() for s in job_skills):
                    job_scores[job_title] += 1
                    relevant_skills.append(skill)
            
            # Extra points for job title mention
            if job_title.lower() in resume_text_lower:
                job_scores[job_title] += 5
                print(f"Found job title mention: {job_title}")
            
            # Add slight boost for related terms
            for skill in job_skills:
                if skill.lower() in resume_text_lower:
                    job_scores[job_title] += 0.5
            
            print(f"Job {job_title}: Score {job_scores[job_title]}, Relevant skills: {relevant_skills}")
        
        # Sort jobs by score in descending order
        sorted_jobs = sorted(job_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Create recommendations for top 3 jobs
        recommendations = []
        for job, score in sorted_jobs[:3]:
            # Calculate confidence - normalize from 0.5 to 0.95 based on scores
            max_possible_score = max(20, max(s for _, s in sorted_jobs))  # Set minimum ceiling
            confidence = 0.5 + ((score / max_possible_score) * 0.45)
            confidence = min(0.95, max(0.5, confidence))  # Clamp between 0.5 and 0.95
            
            # Add to recommendations
            recommendations.append({
                "job_title": job,
                "confidence": round(confidence, 2),
                "score": score,
                "matching_skills": [skill for skill in extracted_skills 
                                   if skill.lower() in (s.lower() for s in self.job_skills[job])]
            })
        
        return {
            "resume_text": resume_text[:300] + ("..." if len(resume_text) > 300 else ""),
            "recommendations": recommendations,
            "method": "improved-keyword-based"
        }
    
    def format_recommendations_with_skills(self, resume_text, filename, recommendations, extracted_skills):
        """Format recommendations with actual extracted skills from the resume text"""
        if not recommendations:
            return {"error": "No recommendations available"}
        
        # Format the job recommendations
        job_recommendations = []
        for i, job in enumerate(recommendations):
            job_title = job["job_title"]
            matching_skills = job.get("matching_skills", [])
            
            # If we have matching skills, use them; otherwise, use default skills
            if matching_skills:
                # Capitalize the first letter of each skill for display purposes
                present_skills = [skill.title() if skill.islower() else skill for skill in matching_skills]
                
                # Limit to 4 skills maximum
                if len(present_skills) > 4:
                    present_skills = present_skills[:4]
                # If fewer than 2 skills, add some generic ones
                elif len(present_skills) < 2:
                    present_skills.extend(["Communication", "Problem Solving"][:2 - len(present_skills)])
            else:
                # Use default skills if no matches
                present_skills = ["Communication", "Problem Solving", "Teamwork", "Adaptability"]
            
            # Get missing skills for this job title
            missing_skills = self.missing_skills_mapping.get(job_title, 
                                              ["Leadership", "Advanced Technical Skills", "Project Management"])
            
            # Get company name
            company = self.company_mapping.get(job_title, f"Company {i+1}")
            
            # Calculate match percentage
            match_percent = int(job["confidence"] * 100)
            
            # Format the job recommendation
            job_recommendations.append({
                "title": job_title,
                "company": company,
                "match": f"{match_percent}% Match",
                "description": f"This role matches your resume profile and skills.",
                "skills": present_skills,
                "learningPath": [
                    {
                        "title": f"Advanced {missing_skills[0]} Course",
                        "provider": "Professional Learning Center",
                        "difficulty": "Intermediate",
                        "description": "Enhance your career prospects with this essential skill."
                    },
                    {
                        "title": f"{job_title} Certification",
                        "provider": "Industry Academy",
                        "difficulty": "Advanced",
                        "description": "Get certified in key technologies for this role."
                    }
                ]
            })
        
        # Generate AI insights based on extracted skills and top recommendation
        if job_recommendations and extracted_skills:
            top_job = job_recommendations[0]
            top_job_title = top_job["title"]
            
            # Get top skills to mention (limit to 3)
            top_skills = top_job["skills"][:3] if len(top_job["skills"]) > 3 else top_job["skills"]
            
            # Get missing skills for this job
            missing_skills = self.missing_skills_mapping.get(top_job_title, 
                                              ["Leadership", "Advanced Technical Skills", "Project Management"])
            missing_skills = missing_skills[:3]  # Limit to 3
            
            # Generate insights
            ai_insights = f"Based on your resume, you have a strong foundation in {', '.join(top_skills)}. "
            ai_insights += f"To increase your prospects as a {top_job_title}, consider developing skills in {', '.join(missing_skills)}."
        else:
            ai_insights = "Based on your resume, consider developing additional technical and soft skills to improve your job prospects."
        
        # Return formatted recommendations
        return {
            "jobRecommendations": job_recommendations,
            "aiInsights": ai_insights
        }


# Create Flask application
app = Flask(__name__)
CORS(app)

# Initialize job recommendation system
job_system = JobRecommendationSystem()

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    """
    Accepts a resume file uploaded by the user and returns job recommendations.
    
    Expected form data:
    - resume_file: File upload
    """
    try:
        if 'resume_file' not in request.files:
            return jsonify({'error': 'No resume file uploaded'}), 400
            
        resume_file = request.files['resume_file']
        
        if resume_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
            
        # Save the uploaded resume temporarily
        temp_path = f"uploads/{resume_file.filename}"
        os.makedirs("uploads", exist_ok=True)  # Ensure the directory exists
        resume_file.save(temp_path)
        
        # Get job recommendations
        result = job_system.get_recommendations(temp_path)
        
        # Clean up temp file
        try:
            os.remove(temp_path)
        except Exception as e:
            print(f"Warning: Could not remove temp file: {e}")
        
        return jsonify(result)
    except Exception as e:
        print(f"Error processing uploaded resume: {e}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500

if __name__ == "__main__":
    print("\n===== JOB RECOMMENDATION SYSTEM API =====\n")
    print("Waiting for user resume uploads...")

    # Start Flask server
    app.run(port=5000, debug=True)