# HireSense

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

![Demo](./demo.gif)

## 🚀 About the Project

**HireSense** is an AI-powered resume analyzer built with **React**, **Node.js**, and **FastAPI**. It uses advanced **NLP** to compare resumes with job descriptions and generate a match score with detailed analytics.

The platform features a modern UI, interactive charts, PDF report generation, secure authentication, and persistent history tracking.

---

## ✨ Features

- **AI-Powered Resume Matching**  
  Extracts text from resumes and compares it with job descriptions using semantic similarity.

- **NLP Microservice Architecture**  
  Uses a dedicated Python FastAPI service for heavy NLP processing.

- **Interactive & Modern UI**  
  Clean responsive frontend with animations and smooth user experience.

- **PDF Report Generation**  
  Export detailed match reports as downloadable PDFs.

- **Analytics Dashboard**  
  Visualize scores and skill analysis with charts.

- **Secure Authentication**  
  JWT-based login and registration system with encrypted passwords.

- **Persistent Match History**  
  Stores previous resume analysis results in MySQL.

- **Scalable Full-Stack Setup**  
  Modular architecture separating frontend, backend, and NLP service.

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| PDF Export | jsPDF + html2canvas |
| Backend | Node.js + Express.js |
| NLP Service | Python + FastAPI + PyTorch + SentenceTransformers |
| Database | MySQL |
| Authentication | JWT + bcryptjs |
| File Handling | Multer + pdfminer.six |

---

## 📁 Project Structure

```text
HireSense/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components, charts, forms, etc.
│   │   ├── pages/            # Home, Login, Register, Profile
│   │   └── utils/            # API utilities
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express backend
│   ├── config/               # Database & environment config
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth & error handling
│   ├── routes/               # API routes
│   ├── server.js
│   └── package.json
│
├── nlp-service/              # Python FastAPI NLP microservice
│   ├── main.py
│   └── requirements.txt
│
└── start.bat                 # Optional startup script
```

---

## ⚙️ Prerequisites

Make sure you have installed:

- **Node.js** (v18 or later)
- **Python** (3.9 or later)
- **MySQL Server**

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nicode-x/HireSense.git
cd HireSense
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Install NLP Service Dependencies

```bash
cd ../nlp-service
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hiresense
JWT_SECRET=your_jwt_secret_key
NLP_SERVICE_URL=http://localhost:8000
```

> ⚠️ **Important:** Never commit your `.env` file to GitHub.  
> Make sure `.env` is included in your `.gitignore`.

---

## ▶️ Running the Application

### Step 1: Start MySQL
Make sure your MySQL server is running and the `hiresense` database exists.

### Step 2: Start NLP Service

```bash
cd nlp-service
uvicorn main:app --reload --port 8000
```

### Step 3: Start Backend

```bash
cd backend
npm run dev
```

### Step 4: Start Frontend

```bash
cd frontend
npm run dev
```

---

## 🧠 How It Works

1. User uploads a **resume PDF** and enters a **job description**.
2. The **React frontend** sends the data to the **Node.js backend**.
3. The backend forwards it to the **FastAPI NLP microservice**.
4. The NLP service extracts text from the resume.
5. It converts both resume text and JD into embeddings using **Sentence Transformers**.
6. It calculates **semantic similarity** to generate a match score.
7. The result is returned and stored in **MySQL**.
8. The frontend displays the analytics and allows **PDF export**.

---

## 📈 Future Enhancements

- **Advanced Skill Extraction**
  - Detect missing and matching skills more accurately using NLP.

- **Resume Suggestions**
  - Provide personalized suggestions to improve the resume.

- **Resume Builder**
  - Let users edit or build resumes directly inside the app.

- **Docker Support**
  - Containerize frontend, backend, NLP service, and database using Docker.

- **Admin Dashboard**
  - Add recruiter/admin-level analytics and user management.

---

## 📸 Screenshots

> Add your project screenshots here

```md
![Home Page](./screenshots/home.png)
![Dashboard](./screenshots/dashboard.png)
![Results](./screenshots/results.png)
```

---

## 🤝 Contributing

Contributions are welcome!

If you'd like to improve this project:

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit and push
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

Developed by **Nikhil Malik**

If you like this project, feel free to ⭐ the repo!
