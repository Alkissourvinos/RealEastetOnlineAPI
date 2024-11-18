# Real Estate Online API

## Philosophy & Architecture
This API is a crucial middleware layer between cloud-based Lambda function and front-end web application in the real estate domain. It follows a microservices architecture pattern, acting as an orchestration layer which serves as:

1. **Data Bridge**: Efficiently channels data between AWS Lambda function and client application, ensuring smooth data flow while maintaining separation of concerns.
2. **State Management**: Maintains application state and handles data persistence through a SQLite database, providing reliable storage for property listings and location data.
3. **Service Integration**: Acts as a unified backend interface, abstracting the complexity of multiple service interactions from the frontend application.
4. **Data Validation**: Implements robust validation logic to ensure data integrity before it reaches the database 

The API is designed with RESTful principles, providing predictable endpoints that the web application can consume to perform CRUD operations on real estate listings and location data. It serves as the backbone for the entire real estate platform, handling everything from data persistence to service coordination.

## Features
- Property advertisement management (CRUD operations)
- Location-based services
- Address validation and geocoding
- Secure API endpoints
- Transaction-safe database operations

### Core Technologies
- **Node.js** (v14+) - Runtime environment
- **Express.js** (v4.18.2) - Web framework
- **SQLite3** (v5.1.6) - Database

## API Endpoints

### Advertisements
- `GET /api/ads/getAllAds` - Retrieve all property listings
- `POST /api/ads/saveAdInDB` - Create new property listing

### Locations
- `POST /api/location/getLocationSuggestions` - Get location suggestions based on input

### Essential Dependencies
```json
{
  "dependencies": {
    "axios": "^1.5.0",           // HTTP client for external API calls
    "cors": "^2.8.5",            // Cross-Origin Resource Sharing middleware
    "dotenv": "^16.3.1",         // Environment variable management
    "express": "^4.18.2",        // Web framework
    "sqlite3": "^5.1.6"          // SQLite database driver
  },
  "devDependencies": {
    "nodemon": "^3.0.1"          // Development server with hot reload
  }
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
1. Clone the repository
```bash
git clone https://github.com/Alkissourvinos/RealEastetOnlineAPI.git
```
2. Install packagies
```bash
cd RealEastetOnlineAPI
```
```bash
npm install
```
3. Run the server
```bash
node server.js
```
