const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

/**
 * Route to fetch location suggestions based on user input
 *
 * @route POST /getLocationSuggestions
 * @body {string} input - Search text for location suggestions
 * @returns {Object} Location suggestions data from AWS Lambda endpoint
 * @throws {400} If input parameter is missing
 * @throws {500} If there's a server error or AWS Lambda call fails
 */
router.post("/getLocationSuggestions", async (req, res) => {
  try {
    // Extract input from request body
    const { input } = req.body;

    // Validate required input parameter
    if (!input) {
      return res.status(400).json({
        status: "error",
        message: "Input parameter is required",
      });
    }

    // Call AWS Lambda endpoint with encoded input parameter
    const response = await axios.get(
      `https://4ulq3vb3dogn4fatjw3uq7kqby0dweob.lambda-url.eu-central-1.on.aws/?input=${encodeURIComponent(
        input
      )}`
    );

    // Return successful response with location suggestions
    return res.status(200).json(response.data);
  } catch (error) {
    // Log and handle any errors that occur
    console.error("Error fetching location suggestions:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch location suggestions",
      error: error.message,
    });
  }
});

module.exports = router;
