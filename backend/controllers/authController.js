const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const JWT_SECRET = process.env.JWT_SECRET || "hiresense_secure_jwt_secret_2026_xK9mP3nQ7rL2vW8";

// ─── Register ────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const checkUserQuery = "SELECT id FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Registration check error:", err);
        return res.status(500).json({ message: "DB error" });
      }
      if (results.length > 0) return res.status(400).json({ message: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 12);
      const insertQuery = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Registration insert error:", err);
          return res.status(500).json({ message: "Error registering user" });
        }
        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (results.length === 0) return res.status(400).json({ message: "Invalid email or password" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url || null,
          created_at: user.created_at,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ─── Get Profile ─────────────────────────────────────────────────────────────
const getProfile = (req, res) => {
  const query = "SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?";
  db.query(query, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.status(200).json(results[0]);
  });
};

// ─── Update Profile ───────────────────────────────────────────────────────────
const updateProfile = (req, res) => {
  const { name } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }

  const query = "UPDATE users SET name = ? WHERE id = ?";
  db.query(query, [name.trim(), req.user.id], (err) => {
    if (err) return res.status(500).json({ message: "Error updating profile" });
    res.status(200).json({ message: "Profile updated", name: name.trim() });
  });
};

// ─── Upload Avatar ────────────────────────────────────────────────────────────
const uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;
  const query = "UPDATE users SET avatar_url = ? WHERE id = ?";
  db.query(query, [avatarUrl, req.user.id], (err) => {
    if (err) {
      // Clean up file on DB error
      fs.unlink(req.file.path, () => {});
      return res.status(500).json({ message: "Error saving avatar" });
    }
    res.status(200).json({ message: "Avatar updated", avatar_url: avatarUrl });
  });
};

// ─── Get Stats ────────────────────────────────────────────────────────────────
const getUserStats = (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_analyses,
      ROUND(AVG(final_score), 1) as avg_score,
      MAX(final_score) as highest_score
    FROM analysis_results
    WHERE user_id = ?
  `;
  db.query(query, [req.user.id], (err, results) => {
    if (err) {
      console.error("Stats query error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.status(200).json(results[0]);
  });
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, uploadAvatar, getUserStats };