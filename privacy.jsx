import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-600">Privacy Policy</h1>

      <p className="mt-4 text-gray-700">
        Welcome to <strong>JobSyncra</strong>, an AI-powered job recommendation portal dedicated to helping users find the best-fit career opportunities and skill-enhancing training programs. Your privacy is essential to us, and we are committed to safeguarding your personal information.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
      <p className="text-gray-700 mt-2">
        To provide accurate job recommendations and training courses, we collect:
      </p>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>Personal details such as name and email address (for account creation).</li>
        <li>Resume content, including work experience, skills, and education.</li>
        <li>User preferences regarding job types and industries.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p className="text-gray-700 mt-2">
        The collected data is utilized to:
      </p>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>Generate personalized job recommendations based on your resume.</li>
        <li>Suggest relevant training courses to enhance your qualifications.</li>
        <li>Improve the AI-powered recommendation system for better accuracy.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">3. Data Security</h2>
      <p className="text-gray-700 mt-2">
        JobSyncra employs industry-standard security measures to protect your data from unauthorized access, loss, or misuse. Your information is encrypted and securely stored.
      </p>

      <h2 className="text-2xl font-semibold mt-6">4. Third-Party Sharing</h2>
      <p className="text-gray-700 mt-2">
        We do <strong>not</strong> sell, trade, or share your personal information with third parties without your consent. However, we may share anonymized data to improve our AI models.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Your Rights and Choices</h2>
      <p className="text-gray-700 mt-2">
        You have full control over your data, including:
      </p>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>Updating or deleting your resume and profile information.</li>
        <li>Requesting data removal from our system upon account deletion.</li>
        <li>Managing email preferences and notifications.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">6. Changes to Privacy Policy</h2>
      <p className="text-gray-700 mt-2">
        We may update this policy periodically. Users will be notified of significant changes affecting their data privacy.
      </p>

      <h2 className="text-2xl font-semibold mt-6">7. Contact Us</h2>
      <p className="text-gray-700 mt-2">
  For any concerns or inquiries regarding your privacy, feel free to contact us at 
  <strong className="text-blue-500"> jobsyncra@gmail.com </strong>.
</p>



      <p className="mt-6 text-gray-500 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default Privacy;
