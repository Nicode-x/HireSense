# 🚀 HireSense AI — Intelligent Resume Screening Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

---

## 🌟 Overview

**HireSense AI** is a full-stack, AI-powered resume screening platform designed to help recruiters **analyze, rank, and evaluate candidates instantly**.

It leverages **Natural Language Processing (NLP)** and **semantic similarity models** to match resumes with job descriptions and generate **data-driven hiring insights**.

> Built with a scalable microservices architecture combining **React + Node.js + FastAPI**

---

## ✨ Key Highlights

- 🧠 **AI Resume Matching Engine** using Sentence Transformers  
- 📊 **Recruiter Dashboard** with analytics & candidate ranking  
- 📄 **Automated PDF Hiring Reports (Enterprise-grade)**  
- 📈 **Skill Gap & Match Analysis**  
- ⚡ **FastAPI NLP Microservice Architecture**  
- 🔐 **JWT Authentication & Secure APIs**  
- 🗂 **Persistent Candidate History Tracking**  
- 🎨 **Modern UI with Tailwind + Animations + Three.js**

---

## 📸 Product Preview

### 🏠 Landing Experience
![Landing](./assets/home-landing.png)

---

### 📊 Recruiter Dashboard
![Dashboard](./assets/dashboard.png)

---

### 🧠 Analyze Candidates
![Analyze](./assets/analyze-page.png)

---

### 🏆 AI Ranked Results
![Results](./assets/results-page.png)

---

### 📜 Analysis History
![History](./assets/history-page.png)

---

### 👤 User Profile
![Profile](./assets/profile-page.png)

---

## 📄 AI-Generated Hiring Report

HireSense generates a **professional recruiter-ready PDF report** including:

- Executive summary
- Candidate rankings
- Skill match analysis
- AI explanations
- Visual analytics

👉 **View Sample Report:**  
[📥 Download Report](./assets/report.pdf)

📊 This report includes real candidate scoring, ranking, and insights as shown in your generated output :contentReference[oaicite:0]{index=0}

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- Three.js

### Backend
- Node.js
- Express.js

### AI / NLP Service
- Python
- FastAPI
- Sentence Transformers
- PyTorch

### Database & Auth
- MySQL
- JWT Authentication
- bcrypt.js

---

## 🧠 System Architecture

```text
Frontend (React)
        ↓
Node.js Backend (API Layer)
        ↓
FastAPI NLP Microservice
        ↓
Semantic Similarity Engine (Sentence Transformers)
        ↓
Database (MySQL)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repo
```bash
git clone https://github.com/Nicode-x/HireSense.git
cd HireSense
```

### 2️⃣ Install Dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# NLP Service
cd ../nlp-service && pip install -r requirements.txt
```

---

### 3️⃣ Environment Setup

Create `.env` in backend:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hiresense
JWT_SECRET=your_secret
NLP_SERVICE_URL=http://127.0.0.1:8000
```

---

### ▶️ Run Application

```bash
# Start NLP Service
cd nlp-service
python -m uvicorn app.main:app --reload --port 8000

# Start Backend
cd backend
npm run dev

# Start Frontend
cd frontend
npm run dev
```

---

## ⚡ How It Works

1. Upload resumes + job description  
2. Backend sends data to NLP microservice  
3. NLP converts text into embeddings  
4. Semantic similarity is calculated  
5. Candidates are ranked based on:
   - Skill match
   - Context relevance
   - Resume quality  
6. Results + insights are displayed  
7. PDF report is generated  

---

## 🚀 Future Scope

- AI Resume Suggestions  
- ATS Score Optimization  
- Recruiter Team Collaboration  
- Docker & Cloud Deployment  
- Interview Recommendation System  

---

## 👨‍💻 Author

**Nikhil Malik**  
Frontend-Focused Full Stack Developer  

💡 Skilled in:
- React / Next.js / Three.js
- Node.js / Express
- AI-integrated applications
- Modern UI/UX systems

---

## ⭐ Support

If you found this project useful:

👉 Star the repository  
👉 Share it with others  

---

## 📌 Final Note

This is not just a project — it’s a **production-style AI SaaS concept** for modern recruitment systems.
