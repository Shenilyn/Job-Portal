import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from './assets/pagelogo.png';

const Contact = () => {
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

      {/* Page Title Banner - Moved outside main content for full width */}
      <div className="bg-blue-500 py-12 w-full">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="text-white text-lg mt-4 max-w-2xl mx-auto">
            Have questions or need support? We're here to help! Reach out to us through the following contact details.
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-10 flex-grow w-full">
        {/* Email Support */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-500">📩 Email Support</h2>
          <p className="text-gray-700 mt-2">
            For inquiries or assistance, email us at:{" "}
            <a href="mailto:jobsyncra@gmail.com" className="text-blue-600 hover:underline">
              jobsyncra@gmail.com
            </a>
          </p>
        </section>

        {/* About JobSyncra */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-500">🌐 About JobSyncra</h2>
          <p className="text-gray-700 mt-2">
            JobSyncra is an <strong>AI-powered job recommendation portal</strong> that analyzes resumes and suggests{" "}
            <strong>3 best-fitted job opportunities</strong>, followed by <strong>3 relevant training courses</strong> to support career growth.
          </p>
        </section>

        {/* Social Media */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-500">💬 Social Media</h2>
          <p className="text-gray-700 mt-2">
            Stay connected for updates and job insights! Follow us on:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>📸 Instagram: <strong>@jobsyncra</strong></li>
            <li>💼 LinkedIn: <strong>JobSyncra</strong></li>
            <li>🐦 Twitter: <strong>@JobSyncraAI</strong></li>
          </ul>
        </section>

        {/* Office Location */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-500">📍 Office Location</h2>
          <p className="text-gray-700 mt-2">
            Our headquarters is based in <strong>Santa Cruz, Calabarzon, Philippines</strong>, where we continuously work on improving AI-driven career guidance.
          </p>
        </section>

        {/* Privacy & Terms */}
        <section className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-500">📜 Privacy & Terms</h2>
          <p className="text-gray-700 mt-2">
            For more details on how we handle user data and system policies, check out:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li><Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-blue-500 hover:underline">Terms & Conditions</Link></li>
          </ul>
        </section>

        {/* Last Updated */}
        <p className="text-sm text-gray-400 mt-6">Last updated: {new Date().toLocaleDateString()}</p>
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

            {/*<div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link to="/resources" className="text-gray-400 hover:text-white">Career Resources</Link></li>
                <li><Link to="/assessment" className="text-gray-400 hover:text-white">Career Assessment</Link></li>
              </ul>
            </div> */}

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

export default Contact;