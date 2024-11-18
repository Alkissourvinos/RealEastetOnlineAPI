const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/main.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to SQLite database");
});

// Create locations table
db.run(`
  CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    placeID TEXT NOT NULL,
    primaryAddress TEXT NOT NULL,
    secondaryAddress TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create ads table with foreign keys
db.run(`
  CREATE TABLE IF NOT EXISTS ads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locationID INTEGER NOT NULL,
    title TEXT NOT NULL,
    adType TEXT NOT NULL,
    propertyCategory TEXT NOT NULL,
    propertyCondition TEXT NOT NULL,
    propertyFloor TEXT NOT NULL,
    propertysize INTEGER NOT NULL,
    buildDate INTEGER,
    renovationDate INTEGER,
    bedrooms INTEGER,
    masterBedrooms INTEGER,
    bathrooms INTEGER,
    WC INTEGER,
    energyClass TEXT,
    price DECIMAL(10,2) NOT NULL,
    propertyZone TEXT NOT NULL,
    extraInfo TEXT,
    contactEmail TEXT NOT NULL,
    contactPhone INTEGER NOT NULL,
    contactHoursFrom TEXT NOT NULL,
    contactHoursTo TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    FOREIGN KEY (locationID) REFERENCES locations(id) ON DELETE CASCADE
  )
`);
// Enable foreign key support
db.run("PRAGMA foreign_keys = ON");

module.exports = db;
