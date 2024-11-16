const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Database/database");

// Utility functions for input sanitization
const sanitizeInput = (str) => {
  if (!str) return str;
  return str
    .trim()
    .replace(/[<>]/g, "") // Remove < and > characters
    .slice(0, 255); // Limit string length
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Test route
router.get("/test", (req, res) => {
  db.get("SELECT 1", (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: "Internal server error", // Don't expose actual error details
      });
    }

    res.status(200).json({
      status: "success",
      message: "Server is running and database is connected",
      timestamp: new Date(),
      dbResponse: result,
    });
  });
});

// Login route
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Sanitize and validate inputs
    email = sanitizeInput(email);
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Find user
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], async (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Create token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
