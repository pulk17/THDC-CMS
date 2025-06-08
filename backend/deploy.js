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

// Login route
app.post('/api/v1/login', async (req, res) => {
  try {
    const { employee_id, employee_password } = req.body;

    // Basic validation
    if (!employee_id || !employee_password) {
      return res.status(400).json({
        success: false,
        message: "Please provide employee ID and password"
      });
    }

    // For the simplified version, we'll just return a mock successful response
    // In a real implementation, you would verify against the database
    console.log(`Login attempt for employee ID: ${employee_id}`);

    // Determine role based on employee_id for testing purposes
    // employee_id starting with 1 are regular employees
    // employee_id starting with 9 are admins
    const isAdmin = String(employee_id).startsWith('9');
    const isWorker = String(employee_id).startsWith('1');

    // Create a mock token
    const token = jwt.sign(
      { id: employee_id },
      process.env.JWT_SECRET || 'fallback-secret-key-for-development',
      { expiresIn: '1d' }
    );

    // Set cookie options
    const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true
    };

    // Create appropriate user object based on role
    const user = {
      _id: `user_${employee_id}`,
      employee_id: Number(employee_id),
      employee_name: isAdmin ? "Admin User" : "Regular Employee",
      employee_role: isAdmin ? "admin" : "employee",
      is_Employee_Worker: isWorker,
      employee_department: isAdmin ? "Administration" : "Operations",
      employee_designation: isAdmin ? "Manager" : "Staff",
      employee_location: "Headquarters",
      employee_email: `user${employee_id}@example.com`
    };

    // Return success response with token
    return res.status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        token,
        user
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Register route
app.post('/api/v1/register', async (req, res) => {
  try {
    const { 
      employee_id, 
      employee_name, 
      employee_designation, 
      employee_department, 
      employee_location, 
      employee_password, 
      employee_email,
      employee_role 
    } = req.body;

    // Basic validation
    if (!employee_id || !employee_name || !employee_password || !employee_email) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    console.log(`Registration attempt for employee ID: ${employee_id}`);

    // For the simplified version, we'll just return a mock successful response
    return res.status(201).json({
      success: true,
      user: {
        employee_id,
        employee_name,
        employee_role: employee_role || "employee",
        employee_department: employee_department || "General",
        employee_designation: employee_designation || "Staff"
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get all complaints endpoint (with optional filtering)
app.get('/api/v1/complaints', isAuthenticated, (req, res) => {
  try {
    const { mine, assigned } = req.query;
    
    console.log(`Complaints request - mine: ${mine}, assigned: ${assigned}`);
    
    // Generate mock complaints data
    const mockComplaints = [
      {
        _id: "c1",
        employee_id: req.user.id,
        employee_name: "Test User",
        employee_location: "Office Building A",
        complaint_asset: "Computer",
        employee_phoneNo: "1234567890",
        complain_details: "Computer not working properly",
        isCompleted: false,
        isFeedback: "",
        assignedTo: null,
        complaint_no: "CMP001",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date()
      },
      {
        _id: "c2",
        employee_id: req.user.id,
        employee_name: "Test User",
        employee_location: "Office Building B",
        complaint_asset: "Printer",
        employee_phoneNo: "1234567890",
        complain_details: "Printer out of ink",
        isCompleted: true,
        isFeedback: "Fixed by replacing ink cartridge",
        assignedTo: "w1",
        complaint_no: "CMP002",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        _id: "c3",
        employee_id: "other_user",
        employee_name: "Another User",
        employee_location: "Office Building C",
        complaint_asset: "Air Conditioner",
        employee_phoneNo: "9876543210",
        complain_details: "AC not cooling properly",
        isCompleted: false,
        isFeedback: "",
        assignedTo: "w1",
        complaint_no: "CMP003",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date()
      }
    ];
    
    // Filter complaints based on query parameters
    let filteredComplaints = [...mockComplaints];
    
    if (mine === 'true') {
      // Return only complaints created by the current user
      filteredComplaints = filteredComplaints.filter(c => c.employee_id === req.user.id);
    } else if (assigned === 'true') {
      // Return complaints assigned to the current user (assuming worker role)
      filteredComplaints = filteredComplaints.filter(c => c.assignedTo === req.user.id);
    }
    
    return res.status(200).json({
      success: true,
      complaints: filteredComplaints
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Get all workers list endpoint
app.get('/api/v1/admin/getWorkerList', isAuthenticated, (req, res) => {
  try {
    // Generate mock workers data
    const mockWorkers = [
      {
        _id: "w1",
        employee_id: 101,
        employee_name: "Worker One",
        employee_designation: "Technician",
        employee_department: "IT",
        employee_location: "Main Office",
        employee_email: "worker1@example.com",
        employee_role: "employee",
        is_Employee_Worker: true
      },
      {
        _id: "w2",
        employee_id: 102,
        employee_name: "Worker Two",
        employee_designation: "Electrician",
        employee_department: "Maintenance",
        employee_location: "Main Office",
        employee_email: "worker2@example.com",
        employee_role: "employee",
        is_Employee_Worker: true
      },
      {
        _id: "w3",
        employee_id: 103,
        employee_name: "Worker Three",
        employee_designation: "Plumber",
        employee_department: "Maintenance",
        employee_location: "Branch Office",
        employee_email: "worker3@example.com",
        employee_role: "employee",
        is_Employee_Worker: true
      }
    ];
    
    return res.status(200).json({
      success: true,
      workers: mockWorkers
    });
  } catch (error) {
    console.error("Error fetching workers list:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Register complaint endpoint
app.post('/api/v1/registerComplaint', isAuthenticated, (req, res) => {
  try {
    const { 
      employee_location, 
      complaint_asset, 
      employee_phoneNo, 
      complain_details 
    } = req.body;
    
    // Basic validation
    if (!employee_location || !complaint_asset || !employee_phoneNo || !complain_details) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }
    
    // Generate a mock complaint with a unique ID and complaint number
    const mockComplaint = {
      _id: `c${Date.now()}`,
      employee_id: req.user.id,
      employee_name: "Test User",
      employee_location,
      complaint_asset,
      employee_phoneNo,
      complain_details,
      isCompleted: false,
      isFeedback: "",
      assignedTo: null,
      complaint_no: `CMP${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return res.status(201).json({
      success: true,
      compaint: mockComplaint
    });
  } catch (error) {
    console.error("Error registering complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Change status of complaint endpoint
app.put('/api/v1/changeStatusOfComplaint', isAuthenticated, (req, res) => {
  try {
    const { id, isCompleted, isFeedback } = req.body;
    
    // Basic validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide complaint ID"
      });
    }
    
    // Mock updated complaint
    const updatedComplaint = {
      _id: id,
      employee_id: req.user.id,
      employee_name: "Test User",
      employee_location: "Office Building A",
      complaint_asset: "Computer",
      employee_phoneNo: "1234567890",
      complain_details: "Computer not working properly",
      isCompleted: isCompleted || false,
      isFeedback: isFeedback || "",
      assignedTo: req.user.id,
      complaint_no: "CMP001",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    
    return res.status(200).json({
      success: true,
      updatedComplaint
    });
  } catch (error) {
    console.error("Error changing complaint status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Assign complaint to worker endpoint
app.put('/api/v1/admin/assignComplaintToWorkers', isAuthenticated, (req, res) => {
  try {
    const { complaint_id, employee_id } = req.body;
    
    // Basic validation
    if (!complaint_id || !employee_id) {
      return res.status(400).json({
        success: false,
        message: "Please provide complaint ID and employee ID"
      });
    }
    
    // Mock assigned complaint
    const complaint = {
      _id: complaint_id,
      employee_id: "some_user",
      employee_name: "Some User",
      employee_location: "Office Building C",
      complaint_asset: "Air Conditioner",
      employee_phoneNo: "9876543210",
      complain_details: "AC not cooling properly",
      isCompleted: false,
      isFeedback: "",
      assignedTo: employee_id,
      complaint_no: "CMP003",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    };
    
    return res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error("Error assigning complaint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Filter complaints endpoint
app.post('/api/v1/admin/filterComplaints', isAuthenticated, (req, res) => {
  try {
    const { startDate, endDate, status } = req.body;
    
    // Generate mock filtered complaints
    const filteredComplaints = [
      {
        _id: "c1",
        employee_id: "user1",
        employee_name: "User One",
        employee_location: "Office Building A",
        complaint_asset: "Computer",
        employee_phoneNo: "1234567890",
        complain_details: "Computer not working properly",
        isCompleted: status === "completed",
        isFeedback: status === "completed" ? "Fixed the issue" : "",
        assignedTo: status === "assigned" ? "w1" : null,
        complaint_no: "CMP001",
        createdAt: new Date(startDate || Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      },
      {
        _id: "c2",
        employee_id: "user2",
        employee_name: "User Two",
        employee_location: "Office Building B",
        complaint_asset: "Printer",
        employee_phoneNo: "1234567890",
        complain_details: "Printer out of ink",
        isCompleted: status === "completed",
        isFeedback: status === "completed" ? "Replaced ink cartridge" : "",
        assignedTo: status === "assigned" ? "w2" : null,
        complaint_no: "CMP002",
        createdAt: new Date(startDate || Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date()
      }
    ];
    
    return res.status(200).json({
      success: true,
      filteredComplaints
    });
  } catch (error) {
    console.error("Error filtering complaints:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

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
    // Get MongoDB URL from environment variables
    let DB_URI = process.env.MONGODB_URL || "mongodb://localhost:27017/cms";
    
    // Ensure the connection string starts with mongodb:// or mongodb+srv://
    if (!DB_URI.startsWith("mongodb://") && !DB_URI.startsWith("mongodb+srv://")) {
      // If it has quotes, remove them
      DB_URI = DB_URI.replace(/^"(.*)"$/, '$1');
      
      // If it still doesn't have the proper prefix, add mongodb://
      if (!DB_URI.startsWith("mongodb://") && !DB_URI.startsWith("mongodb+srv://")) {
        console.warn("MongoDB connection string doesn't start with mongodb:// or mongodb+srv://, adding mongodb://");
        DB_URI = "mongodb://" + DB_URI;
      }
    }
    
    console.log("Connecting to MongoDB...");
    console.log(`Using connection string: ${DB_URI.substring(0, DB_URI.indexOf('@') > 0 ? DB_URI.indexOf('@') : 10)}...`);
    
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
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