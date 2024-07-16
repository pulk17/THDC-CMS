const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const errorMiddleware = require('./middleware/error');

// server build
const app = express();

// middleware for error handling
app.use(errorMiddleware);

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route imports
const user = require('./routes/userRoute.js');
const complaint = require('./routes/complaintRoute.js');

// middleware
app.use("/api/v1", user);
app.use("/api/v1", complaint);

module.exports = app;
