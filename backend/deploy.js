/**
 * Simplified JavaScript version of the THDC Complaint Management System backend
 * This file is used for deployment when TypeScript compilation fails
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Config
// Try to load config.env if it exists
const configPath = path.resolve(__dirname, '../config.env');
if (fs.existsSync(configPath)) {
  console.log(`Loading config from ${configPath}`);
  dotenv.config({ path: configPath });
} else {
  console.log('No config.env file found, using environment variables');
  dotenv.config();
}

// Get allowed origins from environment or use defaults
const allowedOrigins = [
  "http://localhost:3000",
  "https://thdc-3vyrr53u3-pulk17s-projects.vercel.app",
  "https://thdc-3gvn5ln7y-pulk17s-projects.vercel.app",
  "https://thdc-cms.vercel.app"
];

// Middleware
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log("Blocked by CORS: ", origin);
      callback(null, false);
    }
  },
  methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  exposedHeaders: ["set-cookie"]
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple test route
app.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!'
  });
});

// Basic auth middleware
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }
    
    // Verify token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    // Just for this simple version, we'll skip the database lookup
    req.user = { id: decodedData.id };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Basic routes
app.get('/api/v1/logout', (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully"
  });
});

// Connect to database
const connectDatabase = async () => {
  try {
    const DB_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/cms";
    console.log("Connecting to MongoDB...");
    console.log(`Using connection string: ${DB_URI.substring(0, DB_URI.indexOf('@') > 0 ? DB_URI.indexOf('@') : 10)}...`);
    
    await mongoose.connect(DB_URI);
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    console.error("Please check your MongoDB connection string and ensure the MongoDB server is running.");
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    const PORT = process.env.PORT || 6050;
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
    
    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.log(`Error: ${err.message}`);
      console.log("Shutting down the server due to Unhandled Promise Rejection");
      
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer(); 