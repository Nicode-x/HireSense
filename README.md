# 🚀 HireSense AI — Enterprise Resume Screening & Hiring Intelligence

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
</p>

<p align="center">
  <b>AI-powered Resume Screening Platform</b><br/>
  Built for recruiters to intelligently rank, analyze, and compare resumes against job descriptions using NLP.
</p>

---

## ✨ Overview

**HireSense AI** is a full-stack **AI-powered hiring intelligence platform** that helps recruiters and hiring teams:

- Upload **multiple resumes**
- Paste a **job description**
- Automatically **score and rank candidates**
- Analyze **matched vs missing skills**
- Generate a **professional hiring report PDF**
- View **analytics dashboards** with recruiter-ready insights

It combines a **modern React frontend**, a **Node.js/Express backend**, and a dedicated **FastAPI NLP microservice** powered by **Sentence Transformers + PyTorch** for semantic resume matching.

---

## 🌟 Key Features

- 🤖 **AI Resume Matching**  
  Uses semantic similarity and keyword-based skill matching to compare resumes with job descriptions.

- 📄 **PDF Resume Parsing**  
  Extracts text from uploaded resumes for automated evaluation.

- 📊 **Candidate Ranking Dashboard**  
  Displays shortlisted candidates ranked by final score.

- 🧠 **Skill Gap Analysis**  
  Shows matched skills and missing skills for every candidate.

- 📈 **Analytics & Visual Insights**  
  Interactive charts for score comparison and skill distribution.

- 🧾 **Enterprise Hiring Report Export**  
  Generates recruiter-friendly PDF reports for hiring decisions.

- 🔐 **Authentication System**  
  Secure login and registration using JWT auth.

- 🎨 **Premium UI/UX**  
  Modern glassmorphism interface with smooth animations and 3D visuals.

---

## 🖼️ Project Preview

### 🔹 Hero / Landing Page
<p align="center">
  <img src="./assets/hero.png" width="90%" alt="Hero Section" />
</p>

### 🔹 Upload & Analyze Interface
<p align="center">
  <img src="./assets/upload-form.png" width="90%" alt="Upload Form" />
</p>

### 🔹 Recruiter Dashboard
<p align="center">
  <img src="./assets/dashboard.png" width="90%" alt="Recruiter Dashboard" />
</p>

### 🔹 Ranked Candidate Results
<p align="center">
  <img src="./assets/ranked-dashboard.png" width="90%" alt="Ranked Candidates" />
</p>

### 🔹 Score Comparison Analytics
<p align="center">
  <img src="./assets/score-comparison.png" width="90%" alt="Score Comparison" />
</p>

---

## 📑 Demo Hiring Report

HireSense AI can generate a professional **candidate screening report** after resume analysis.

### 🔹 Report Preview
<p align="center">
  <img src="./assets/report-preview.png" width="80%" alt="Hiring Report Preview" />
</p>

### 🔹 Download Full Demo Report
<p align="center">
  <a href="./assets/demo-report.pdf" target="_blank">
    <img src="https://img.shields.io/badge/View%20Demo%20Report-PDF-red?style=for-the-badge&logo=adobeacrobatreader&logoColor=white" />
  </a>
</p>

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **3D / UI** | Three.js, React Three Fiber, Drei |
| **Charts / Reports** | Recharts, html2canvas, jsPDF |
| **Backend** | Node.js, Express.js |
| **AI / NLP Service** | Python, FastAPI, SentenceTransformers, PyTorch |
| **Database** | MySQL |
| **Authentication** | JWT, bcryptjs |
| **File Handling** | Multer, PDF text extraction |

---

## 🧠 How It Works

```mermaid
flowchart LR
A[Recruiter uploads resumes + JD] --> B[Node.js Backend]
B --> C[FastAPI NLP Service]
C --> D[Resume Text Extraction]
D --> E[Sentence Transformer Embeddings]
E --> F[Semantic Similarity + Skill Match]
F --> G[Candidate Scores + Insights]
G --> H[MySQL Database]
H --> I[React Dashboard + PDF Report]
