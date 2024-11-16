const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("\n===========================================");
  console.log("🚀  Server Status: 🚀");
  console.log("-------------------------------------------");
  console.log(`🔥 Server is blazing fast on port: ${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log("-------------------------------------------");
  console.log("===========================================");
});
