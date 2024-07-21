// app.js

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middleware/error.js'); // Update to match your error handler file

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoute.js');
const complaintRoutes = require('./routes/complaintRoute.js');

app.use("/api/v1", userRoutes);
app.use("/api/v1", complaintRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
