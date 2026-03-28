const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");
const { analyzeResumes, getHistory } = require("../controllers/resumeController");

const router = express.Router();

const upload = multer({
  dest: "uploads/resumes/",
  limits: { fileSize: 10 * 1024 * 1024, files: 20 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

router.post("/analyze", optionalAuthMiddleware, upload.array("files"), analyzeResumes);
router.get("/history", authMiddleware, getHistory);

module.exports = router;