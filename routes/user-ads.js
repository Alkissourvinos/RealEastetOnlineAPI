const express = require("express");
const router = express.Router();
const db = require("../Database/database");

/**
 * Route to fetch all ads with their associated location information
 *
 * @route GET /getAllAds
 * @returns {Object} Object containing success status and array of formatted ads
 * @throws {500} If there's a database or server error
 */
router.get("/getAllAds", async (req, res) => {
  try {
    // Query to get all ads joined with their location data, ordered by creation date
    db.all(
      `SELECT 
        ads.*,
        locations.placeID,
        locations.primaryAddress,
        locations.secondaryAddress
      FROM ads
      LEFT JOIN locations ON ads.locationID = locations.id
      ORDER BY ads.created_at DESC`,
      (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Error fetching ads" });
        }

        // Transform raw database rows into properly structured ad objects
        // Separates location data into a nested location object
        const formattedAds = rows.map((row) => {
          const {
            placeID,
            primaryAddress,
            secondaryAddress,
            locationID,
            ...adData
          } = row;

          return {
            ...adData,
            location: {
              id: locationID,
              placeID,
              primaryAddress,
              secondaryAddress,
            },
          };
        });

        // Send successful response with formatted ads
        res.status(200).json({
          success: true,
          ads: formattedAds,
        });
      }
    );
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Route to save a new ad with its location information
 *
 * @route POST /saveAdInDB
 * @body {Object} payload - Contains all ad details and location information
 * @returns {Object} Success status, message, and created ad details
 * @throws {500} If there's a database or server error during any step
 */
router.post("/saveAdInDB", async (req, res) => {
  try {
    const { payload } = req.body;

    // Use SQLite's transaction to ensure data consistency
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // First check if the location already exists in database
      db.get(
        `SELECT id FROM locations WHERE placeID = ?`,
        [payload.placeID],
        (err, existingLocation) => {
          if (err) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Error checking location" });
          }

          /**
           * Helper function to insert ad using location ID
           * Handles the ad insertion process once we have a valid location ID
           * @param {number} locationId - The ID of the location to associate with the ad
           */
          const handleLocationId = (locationId) => {
            // Insert the new ad with all its details
            db.run(
              `INSERT INTO ads (
                locationID, title, adType, propertyCategory, 
                propertyCondition, propertyFloor, propertysize,
                buildDate, renovationDate, bedrooms, masterBedrooms,
                bathrooms, WC, energyClass, price, propertyZone,
                extraInfo, contactEmail, contactPhone,
                contactHoursFrom, contactHoursTo
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                locationId,
                payload.title,
                payload.adType,
                payload.propertyCategory,
                payload.propertyCondition,
                payload.propertyFloor,
                payload.propertysize,
                payload.buildDate,
                payload.renovationDate,
                payload.bedrooms,
                payload.masterBedrooms,
                payload.bathrooms,
                payload.WC,
                payload.energyClass,
                payload.price,
                payload.propertyZone,
                payload.extraInfo,
                payload.contactInfo.email,
                payload.contactInfo.phone,
                payload.contactInfo.contactHoursFrom,
                payload.contactInfo.contactHoursTo,
              ],
              function (err) {
                if (err) {
                  db.run("ROLLBACK");
                  return res.status(500).json({ error: "Error inserting ad" });
                }

                const adId = this.lastID;

                // Retrieve the automatically generated timestamp
                db.get(
                  `SELECT created_at FROM ads WHERE id = ?`,
                  [adId],
                  (err, row) => {
                    if (err) {
                      db.run("ROLLBACK");
                      return res
                        .status(500)
                        .json({ error: "Error retrieving timestamp" });
                    }

                    // Commit transaction and send success response
                    db.run("COMMIT");
                    res.status(200).json({
                      success: true,
                      message: "Ad created successfully",
                      adId: adId,
                      locationId: locationId,
                      createdAt: row.created_at,
                    });
                  }
                );
              }
            );
          };

          if (existingLocation) {
            // If location exists, use its ID to create the ad
            handleLocationId(existingLocation.id);
          } else {
            // If location doesn't exist, insert new location first
            db.run(
              `INSERT INTO locations (placeID, primaryAddress, secondaryAddress) 
               VALUES (?, ?, ?)`,
              [
                payload.placeID,
                payload.primaryAddress,
                payload.secondaryAddress,
              ],
              function (err) {
                if (err) {
                  db.run("ROLLBACK");
                  return res
                    .status(500)
                    .json({ error: "Error inserting location" });
                }
                // Use the new location's ID to create the ad
                handleLocationId(this.lastID);
              }
            );
          }
        }
      );
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
