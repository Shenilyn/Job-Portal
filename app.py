import os
import requests
from flask import Flask, request, jsonify
from pdfplumber import open as open_pdf
from docx import Document

app = Flask(__name__)

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY

def extract_text_from_pdf(file):
    with open_pdf(file) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
        return text

def extract_text_from_docx(file):
    doc = Document(file)
    text = ""
    for para in doc.paragraphs:
        text += para.text
    return text

@app.route('/dashboard', methods=['POST'])
def handle_resume_upload():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file found"}), 400
    
    file = request.files['resume']
    file_name = file.filename
    
 
    if file_name.endswith('.pdf'):
        resume_text = extract_text_from_pdf(file)
    elif file_name.endswith('.docx'):
        resume_text = extract_text_from_docx(file)
    else:
        return jsonify({"error": "Invalid file format. Only PDF and DOCX are supported."}), 400
    
  
    payload = {
        "input": {
            "text": resume_text
        }
    }

    try:
        response = requests.post(GEMINI_API_URL, json=payload)
        if response.status_code == 200:
            result = response.json()
            # Extract relevant data from Gemini API response
            job_matches = result.get('generatedContent', [])
            return jsonify({"topJobs": job_matches}), 200
        else:
            return jsonify({"error": "Failed to get response from Gemini API"}), 500
    except Exception as e:
        return jsonify({"error": f"Error while calling Gemini API: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
