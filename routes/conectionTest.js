const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Database/database");

// Test route
router.get("/test", (req, res) => {
  // Test database connection
  db.get("SELECT 1", (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Database connection failed",
        error: err.message,
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

// Rest of your routes (register and login) remain the same...
