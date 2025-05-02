import React, { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseKey?.slice(0, 10), '...');

const supabase = createClient(supabaseUrl, supabaseKey);

const ResumeUpload = ({ onResumeUpload }) => {
  const handleFileUpload = async (file) => {
    if (!file) return;

    const filePath = `resumes/${Date.now()}-${file.name}`;
    console.log('Uploading file to path:', filePath);

    const { data, error } = await supabase.storage
      .from('userresume')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('❌ Upload error:', error.message);
    } else {
      console.log('✅ File uploaded:', data);

      const { data: urlData, error: urlError } = supabase.storage
        .from('userresume')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error('Error generating public URL:', urlError.message);
      }

      onResumeUpload({
        path: filePath,
        publicUrl: urlData?.publicUrl || null,
      });
      
      fetch('http://localhost:5174/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: urlData?.publicUrl,
          filePath,
          userId: 'some-user-id', // pass the user's ID if available
        }),
      });
      
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handlePaste = useCallback((e) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) {
            handleFileUpload(file);
          }
        }
      }
    }
  }, []);

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md"
      onDrop={handleDrop}
      onDragOver={preventDefaults}
      onDragEnter={preventDefaults}
      onPaste={handlePaste}
    >
      <h3 className="text-lg font-semibold mb-4">Upload Your Resume</h3>
      <p className="text-gray-600 mb-6">
        Upload your resume to get personalized job matches and skill recommendations.
      </p>
      <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
        <input
          type="file"
          id="resume-upload"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />
        <label
          htmlFor="resume-upload"
          className="cursor-pointer flex flex-col items-center"
        >
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
          <span className="mt-2 text-gray-600">Click, paste, or drag and drop your file</span>
          <span className="mt-1 text-gray-500 text-sm">PDF, DOC, DOCX files supported</span>
        </label>
      </div>
    </div>
  );
};

export default ResumeUpload;
