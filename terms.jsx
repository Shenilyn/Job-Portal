import React from "react";
import { Link } from "react-router-dom";
import Logo from './assets/pagelogo.png';

const Terms = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      {/* Header */}
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

            <nav className="hidden md:flex space-x-14 items-center">
                <Link to="/" className="text-gray-800 hover:text-blue-500 tracking-wider">Home</Link>
                <Link to="/about" className="text-gray-800 hover:text-blue-500 tracking-wider">About</Link>
                <Link to="/contact" className="text-gray-800 hover:text-blue-500 tracking-wider">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Title Banner */}
      <div className="bg-blue-500 py-12 w-full">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-white text-lg mt-4 max-w-2xl mx-auto">
            Please review our terms and conditions for using the JobSyncra platform.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
          <p className="text-gray-700">
            Welcome to <strong>JobSyncra</strong>, an AI-powered job recommendation portal designed to help users find career opportunities and skill-enhancing training programs. By using our platform, you agree to the following terms and conditions.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mt-2">
            By accessing and using JobSyncra, you acknowledge that you have read, understood, and agree to comply with these Terms & Conditions.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">2. User Eligibility</h2>
          <p className="text-gray-700 mt-2">
            JobSyncra is intended for individuals seeking employment and career advancement. Users must provide accurate information and ensure compliance with applicable laws.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">3. AI-Powered Job Recommendations</h2>
          <p className="text-gray-700 mt-2">
            Our system analyzes your resume and recommends three best-fitted job opportunities. While we strive for accuracy, we do not guarantee employment and encourage users to verify job details before applying.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">4. Suggested Training Courses</h2>
          <p className="text-gray-700 mt-2">
            JobSyncra suggests three relevant training courses for each recommended job. These are based on AI analysis, but users should conduct further research to ensure they meet their personal career goals.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">5. Data Privacy & Security</h2>
          <p className="text-gray-700 mt-2">
            Your personal data, including your resume, is used solely for generating job and training recommendations. We implement security measures to protect user data. Review our <strong><Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link></strong> for full details.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">6. User Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Users must provide truthful information and keep their profiles updated.</li>
            <li>Users must not misuse JobSyncra or attempt unauthorized access.</li>
            <li>Users are responsible for verifying job opportunities and course details.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">7. Limitation of Liability</h2>
          <p className="text-gray-700 mt-2">
            JobSyncra provides AI-powered recommendations but does not guarantee job placement. We are not responsible for third-party job listings, employer actions, or course providers.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">8. Modifications to Terms</h2>
          <p className="text-gray-700 mt-2">
            JobSyncra reserves the right to modify these Terms & Conditions at any time. Users will be notified of major changes.
          </p>

          <h2 className="text-2xl font-semibold text-blue-500 mt-6">9. Contact Information</h2>
          <p className="text-gray-700 mt-2">
            For any questions about our Terms & Conditions, contact us at <a href="mailto:jobsyncra@gmail.com" className="text-blue-600 hover:underline">jobsyncra@gmail.com</a>.
          </p>

          <p className="mt-6 text-gray-500 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>

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
              <h4 className="text-lg font-semibold mb-4">Support</h4>
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

export default Terms;