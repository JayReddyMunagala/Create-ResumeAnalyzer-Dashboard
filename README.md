# 📄 Resume Analyzer & Job Match Predictor + ATS Scoring

An intelligent web application that helps job seekers evaluate and improve their resumes by analyzing skills, matching job titles, identifying gaps, and accurately scoring their resume against any job description using an ATS-style system.

---

## 🚀 Overview

This app is built to simulate how actual companies screen resumes using Applicant Tracking Systems (ATS). Users can upload or paste their resume and a job description to receive:

- AI-powered job title suggestions  
- A list of extracted hard and soft skills  
- Missing skills based on target roles  
- A detailed ATS score out of 100  
- GPT-generated feedback to improve the resume

All in one clean, interactive dashboard.

---

## 🔑 Key Features

- **Upload or Paste Resume**  
  Upload your resume (PDF/DOCX) or paste text directly. The app will extract and display the content.

- **Paste or Upload Job Description**  
  Easily compare your resume to a target job description by uploading or pasting it.

- **Skill Extraction**  
  Automatically pulls out hard and soft skills from your resume using NLP.

- **Job Title Suggestions**  
  Uses OpenAI to suggest roles that best match your current skill set.

- **Skill Gap Checker**  
  Select a target job (e.g., “Data Analyst”) and view which essential skills you’re missing.

- **ATS Score**  
  Calculates an accurate ATS match score using:
  - ✅ Skill match (40%)  
  - ✅ Keyword overlap (30%)  
  - ✅ Title alignment (20%)  
  - ✅ Formatting check (10%)

- **AI Resume Tips**  
  GPT gives natural-language feedback to improve your resume based on the job description.

- **History (Optional)**  
  Tracks your previous resume uploads and scores for continuous improvement.

---

## 🧰 Tech Stack

- **Frontend**: React, Tailwind CSS (via Bolt.new)
- **AI Engine**: OpenAI GPT API
- **NLP Logic**: Keyword extraction, string similarity
- **Storage**: LocalStorage for history (optional)
- **File Handling**: Resume and JD upload via placeholder logic (can integrate real backend)

---

## 📈 Use Cases

- Students and professionals refining their resumes
- Career coaches or consultants offering client tools
- Analytics for job matching platforms or SaaS recruitment
