const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const db = require("../config/db");

const analyzeResumes = async (req, res) => {
  try {
    const { job_description } = req.body;
    const files = req.files;

    console.log("Job Description:", job_description);
    console.log("Files:", files);

    if (!job_description || !files || files.length === 0) {
      return res.status(400).json({
        message: "Job description and resumes are required",
      });
    }

    const formData = new FormData();
    formData.append("job_description", job_description);

    files.forEach((file) => {
      formData.append("files", fs.createReadStream(file.path), file.originalname);
    });

    // Send files to Python NLP service
    const response = await axios.post(
      "http://127.0.0.1:8000/analyze-multiple-resumes/",
      formData,
      {
        headers: formData.getHeaders(),
      }
    ).catch(err => {
      if (err.code === 'ECONNREFUSED') {
        throw new Error("Python NLP service is not running. Please make sure to start the Python server on port 8000.");
      }
      throw err;
    });

    let rankedCandidates = response.data.ranked_candidates;

    // Save each candidate result into MySQL ONLY if user is authenticated
    if (req.user && req.user.id) {
      // Fetch previous candidates for this JD to build the leaderboard
      const prevQuery = `SELECT * FROM analysis_results WHERE user_id = ? AND job_description = ?`;
      const prevResults = await new Promise((resolve) => {
        db.query(prevQuery, [req.user.id, job_description], (err, results) => {
          if (err) resolve([]); // safely resolve empty if error
          else resolve(results);
        });
      });

      const pastCandidates = prevResults.map(r => ({
        filename: r.filename,
        final_score: r.final_score,
        skill_match_score: r.skill_match_score,
        semantic_score: r.semantic_score,
        matched_skills: r.matched_skills ? r.matched_skills.split(", ") : [],
        missing_skills: r.missing_skills ? r.missing_skills.split(", ") : [],
        explanation: r.explanation
      }));

      // Filter out past candidates if they were just re-uploaded
      const newFilenames = new Set(rankedCandidates.map(c => c.filename));
      const filteredPast = pastCandidates.filter(c => !newFilenames.has(c.filename));

      // Combine and sort total leaderboard
      rankedCandidates = [...rankedCandidates, ...filteredPast].sort((a, b) => b.final_score - a.final_score);

      // Save only the newly analyzed ones to DB
      response.data.ranked_candidates.forEach((candidate) => {
        const query = `
          INSERT INTO analysis_results
          (user_id, job_description, filename, final_score, skill_match_score, semantic_score, matched_skills, missing_skills, explanation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          req.user.id,
          job_description,
          candidate.filename,
          candidate.final_score,
          candidate.skill_match_score,
          candidate.semantic_score,
          candidate.matched_skills.join(", "),
          candidate.missing_skills.join(", "),
          candidate.explanation,
        ];

        db.query(query, values, (err) => {
          if (err) console.error("Error saving to DB:", err.message);
          else console.log(`Saved ${candidate.filename} to DB for user ${req.user.id}`);
        });
      });
    } else {
      console.log("Guest analysis completed. Results not saved to DB.");
    }

    res.status(200).json({ job_description, ranked_candidates: rankedCandidates });
  } catch (error) {
    console.error("FULL ERROR:", error.message || error);
    res.status(500).json({
      message: error.message === "Python NLP service is not running. Please make sure to start the Python server on port 8000." 
        ? error.message 
        : "Error analyzing resumes",
      error: error.response?.data || error.message,
    });
  }
};

const getHistory = async (req, res) => {
  try {
    const query = `
      SELECT * FROM analysis_results
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 100
    `;

    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        console.error("Error fetching history:", err.message);
        return res.status(500).json({ message: "DB error" });
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error("History API error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { analyzeResumes,  getHistory  };