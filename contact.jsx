import React from "react";

const Contact = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-600">Contact Us</h1>

      <p className="mt-4 text-gray-700">
        Have questions or need support? We're here to help! Reach out to us through the following contact details.
      </p>

      <h2 className="text-2xl font-semibold mt-6">📩 Email Support</h2>
      <p className="text-gray-700 mt-2">
        For inquiries or assistance, email us at: 
        <strong className="text-blue-500"> jobsyncra @ gmail.com </strong>.
      </p>

      <h2 className="text-2xl font-semibold mt-6">🌐 About JobSyncra</h2>
      <p className="text-gray-700 mt-2">
  JobSyncra is an <strong>AI-powered job recommendation portal</strong> that analyzes resumes and suggests 
  <strong>3 best-fitted job opportunities</strong>, followed by <strong>3 relevant training courses</strong> to support career growth.
</p>


      <h2 className="text-2xl font-semibold mt-6">💬 Social Media</h2>
      <p className="text-gray-700 mt-2">
        Stay connected for updates and job insights! Follow us on:
      </p>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>📸 Instagram: <strong>@jobsyncra</strong></li>
        <li>💼 LinkedIn: <strong>JobSyncra</strong></li>
        <li>🐦 Twitter: <strong>@JobSyncraAI</strong></li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">📍 Office Location</h2>
      <p className="text-gray-700 mt-2">
        Our headquarters is based in <strong>Santa Cruz, Calabarzon, Philippines</strong>, where we continuously work on improving AI-driven career guidance.
      </p>

      <h2 className="text-2xl font-semibold mt-6">📜 Privacy & Terms</h2>
      <p className="text-gray-700 mt-2">
        For more details on how we handle user data and system policies, check out:
      </p>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li><a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a></li>
        <li><a href="/terms" className="text-blue-500 hover:underline">Terms & Conditions</a></li>
      </ul>

      <p className="mt-6 text-gray-500 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default Contact;
