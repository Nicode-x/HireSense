---

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)

![Demo](./demo.gif)

A premium, enterprise-grade resume analyzer built with **React 19**, **Node.js**, and **FastAPI**. HireSense leverages advanced NLP using Sentence Transformers and PyTorch to dynamically score resumes against job descriptions. It features a stunning "Latte" dark-themed aesthetic with interactive 3D elements and robust analytics.

---

## Screenshots

| Recruiter Dashboard | Ranked Candidates |
| :---: | :---: |
| ![Recruiter Dashboard](./screenshots/dashboard.png) | ![Ranked Candidates](./screenshots/ranked-dashboard.png) |
| **Score Comparison** | **Upload & Analyze** |
| ![Score Comparison](./screenshots/score-comparison.png) | ![Upload Form](./screenshots/upload-form.png) |
| **Hero Landing Page** | |
| ![Hero Landing Page](./screenshots/hero.png) | |

---

## Features
- **AI-Powered Matching** — Extracts text using `pdfminer.six` and calculates semantic similarity scores between resumes and job descriptions using a PyTorch-backed NLP microservice.
- **Microservices Architecture** — A robust Node.js/Express backend handles user authentication and API routing, offloading heavy text processing to a dedicated Python/FastAPI service.
- **Interactive 3D UI** — A beautiful, interactive background featuring floating 3D objects powered by React Three Fiber and Drei, creating a premium and dynamic user experience.
- **Enterprise Reporting** — Generate and download comprehensive MATCH reports as high-quality PDFs (`html2canvas` & `jsPDF`).
- **Data Visualisation** — Visualise match scores and skill analytics via responsive charts powered by Recharts.
- **Secure Authentication** — JWT-based auth with `bcryptjs` for secure login, registration, and persistent user sessions.
- **Persistent History** — Matches and uploaded data are safely stored in a MySQL database, allowing users to track their historical resume performance.
- **Glassmorphism Design** — A cohesive, warm dark design using modern Tailwind CSS v4, smooth Framer Motion animations, and custom cursor effects.

---

## Tech Stack
| Layer | Technology |
|---|---|
| UI framework | React 19 + Framer Motion |
| 3D Graphics | Three.js + React Three Fiber |
| Charts & PDFs | Recharts + jsPDF / html2canvas |
| Styling | Tailwind CSS v4 |
| Core Backend | Node.js + Express.js |
| NLP Microservice | Python + FastAPI + PyTorch + SentenceTransformers |
| Database | MySQL |
| Authentication | JWT + bcryptjs |
| File Handling | Multer + pdfminer.six |

---

## Project Structure
```text
HireSense/
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # 3D Backgrounds, Charts, Navbar, UploadForm, etc.
│   │   ├── pages/            # Home, Login, Register, Profile, NotFound
│   │   └── utils/            # Axios API config
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js + Express API
│   ├── config/               # Database and Env configurations
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth and error handling filters
│   ├── routes/               # API endpoints
│   ├── server.js             # Express entry point
│   └── package.json
├── nlp-service/              # Python FastAPI Microservice
│   ├── main.py               # API endpoints and NLP logic
│   └── requirements.txt      # PyTorch, FastAPI, etc.
└── start.bat                 # Unified startup script
```

---

### Prerequisites
- Node.js v18 or later
- Python 3.9 or later
- MySQL Server (running locally or remotely)

### Installation
```bash
# Clone the repository
git clone https://github.com/Nicode-x/HireSense.git
cd HireSense

# Install Frontend dependencies
cd frontend
npm install

# Install Backend dependencies
cd ../backend
npm install

# Install NLP Service dependencies
cd ../nlp-service
pip install -r requirements.txt
```

### Environment Variables
Create a `.env` file in the project workspace (or inside the backend and nlp directories based on your configuration):

**Backend `.env`:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hiresense
JWT_SECRET=your_jwt_secret_key
NLP_SERVICE_URL=http://localhost:8000
```

> ⚠️ **Important:** Never commit your `.env` file to version control. It should be listed in your `.gitignore`.

### Running the App
You can use the provided `.bat` file to start all services consecutively, or run them individually:

```bash
# 1. Start MySQL server and ensure the database exists.

# 2. Start Python NLP Microservice
cd nlp-service
uvicorn main:app --reload --port 8000

# 3. Start Node.js Backend
cd backend
npm run dev # or node server.js

# 4. Start React Frontend
cd frontend
npm run dev
```

---

### System Architecture
HireSense leverages a modern microservice architecture to decouple standard web server tasks from heavy machine learning workloads. 

**Data Flow:**
1. A user uploads a PDF resume and a textual job description via the React frontend.
2. The Node/Express backend receives the multipart form data (via `multer`) and acts as an orchestrator.
3. The backend forwards the payload to the FastAPI NLP microservice.
4. Python's `pdfminer.six` extracts raw text from the PDF.
5. HuggingFace's `sentence-transformers` (accelerated by PyTorch) converts both texts into high-dimensional vector embeddings and calculates their cosine similarity.
6. The score and analytical breakdown are returned through the Node server and persisted to MySQL.
7. The React UI displays the results via dynamic Recharts and allows exporting via `jsPDF`.

---

## Possible Enhancements
- **Advanced Skill Extraction** — Implement Named Entity Recognition (NER) in the Python service to highlight exact missing keywords vs present keywords.
- **Interactive Parsing** — Allow users to manually correct or highlight parsed text fields before matching.
- **Resume Builder** — Implement a Markdown/WYSIWYG editor allowing users to fix their resume natively based on the provided feedback score.
- **Dockerization** — Package the frontend, backend, NLP service, and MySQL Database into isolated Docker containers controlled via `docker-compose`.

---

## License
ISC
