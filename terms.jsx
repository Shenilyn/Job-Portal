import React from "react";

const Terms = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-600">Terms & Conditions</h1>

      <p className="mt-4 text-gray-700">
        Welcome to <strong>JobSyncra</strong>, an AI-powered job recommendation portal designed to help users find career opportunities and skill-enhancing training programs. By using our platform, you agree to the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6">1. Acceptance of Terms</h2>
      <p className="text-gray-700 mt-2">
        By accessing and using JobSyncra, you acknowledge that you have read, understood, and agree to comply with these Terms & Conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-6">2. User Eligibility</h2>
      <p className="text-gray-700 mt-2">
        JobSyncra is intended for individuals seeking employment and career advancement. Users must provide accurate information and ensure compliance with applicable laws.
      </p>

      <h2 className="text-2xl font-semibold mt-6">3. AI-Powered Job Recommendations</h2>
      <p className="text-gray-700 mt-2">
        Our system analyzes your resume and recommends three best-fitted job opportunities. While we strive for accuracy, we do not guarantee employment and encourage users to verify job details before applying.
      </p>

      <h2 className="text-2xl font-semibold mt-6">4. Suggested Training Courses</h2>
      <p className="text-gray-700 mt-2">
        JobSyncra suggests three relevant training courses for each recommended job. These are based on AI analysis, but users should conduct further research to ensure they meet their personal career goals.
      </p>

      <h2 className="text-2xl font-semibold mt-6">5. Data Privacy & Security</h2>
      <p className="text-gray-700 mt-2">
        Your personal data, including your resume, is used solely for generating job and training recommendations. We implement security measures to protect user data. Review our <strong><a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a></strong> for full details.
      </p>

      <h2 className="text-2xl font-semibold mt-6">6. User Responsibilities</h2>
      <ul className="list-disc list-inside text-gray-700 mt-2">
        <li>Users must provide truthful information and keep their profiles updated.</li>
        <li>Users must not misuse JobSyncra or attempt unauthorized access.</li>
        <li>Users are responsible for verifying job opportunities and course details.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6">7. Limitation of Liability</h2>
      <p className="text-gray-700 mt-2">
        JobSyncra provides AI-powered recommendations but does not guarantee job placement. We are not responsible for third-party job listings, employer actions, or course providers.
      </p>

      <h2 className="text-2xl font-semibold mt-6">8. Modifications to Terms</h2>
      <p className="text-gray-700 mt-2">
        JobSyncra reserves the right to modify these Terms & Conditions at any time. Users will be notified of major changes.
      </p>

      <h2 className="text-2xl font-semibold mt-6">9. Contact Information</h2>
      <p className="text-gray-700 mt-2">
    For any questions about our Terms & Conditions, contact us at <strong className="text-blue-500"> jobsyncra@gmail.com </strong>.
</p>


      <p className="mt-6 text-gray-500 text-sm">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default Terms;
