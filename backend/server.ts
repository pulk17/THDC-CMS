import app from './app';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
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

// Connect to database
const connectDatabase = async (): Promise<void> => {
  try {
    const DB_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/cms";
    console.log("Connecting to MongoDB...");
    console.log(`Using connection string: ${DB_URI.substring(0, DB_URI.indexOf('@') > 0 ? DB_URI.indexOf('@') : 10)}...`);
    
    await mongoose.connect(DB_URI, {
      // Add connection options if needed
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    console.error("Please check your MongoDB connection string and ensure the MongoDB server is running.");
    console.error("You can also try using a local MongoDB instance by setting MONGODB_URL to mongodb://localhost:27017/thdc_complaint_management");
    process.exit(1);
  }
};

connectDatabase();

// Start server
const PORT = process.env.PORT || 6050;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  
  server.close(() => {
    process.exit(1);
  });
}); 