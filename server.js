const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env file

// Import route handlers
const userAdsRoutes = require("./routes/user-ads");
const locationRoutes = require("./routes/locations");

// Initialize Express application
const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure CORS - Cross Origin Resource Sharing
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"], // Allowed HTTP methods
    allowedHeaders: "*", // Allow all headers
  })
);

// Create dedicated router for API endpoints
const apiRouter = express.Router();

// Mount API router at /api path
app.use("/api", apiRouter);

// Mount specific route handlers on API router
apiRouter.use("/ads", userAdsRoutes); // Ads related endpoints
apiRouter.use("/location", locationRoutes); // Location related endpoints

/**
 * Optional redirect from root to /api
 * Useful for directing users to the API base path
 */
app.get("/", (req, res) => {
  res.redirect("/api");
});

/**
 * Handle 404 errors for API routes
 * Returns JSON response for missing API endpoints
 */
apiRouter.use((req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

/**
 * Handle general 404 errors
 * Catches all unmatched routes outside of /api
 */
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Server configuration and startup
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("\n===========================================");
  console.log("🚀  Server Status: 🚀");
  console.log("-------------------------------------------");
  console.log(`🔥 Server is blazing fast on port: ${PORT}`);
  console.log(`📅 Started at: ${new Date().toLocaleString()}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
  console.log("-------------------------------------------");
  console.log("===========================================");
});
