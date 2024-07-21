// errorhandler.js

const ErrorHandler = require('../utils/errorhandler');

const errorhandle = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // JsonWebToken error
    if (err.name === "JsonWebTokenError") {
        const message = `Json web token is invalid. Please try again`;
        err = new ErrorHandler(message, 400);
    }

    // JsonWebToken expired error
    if (err.name === "TokenExpiredError") {
        const message = `Json web token is expired. Please try again`;
        err = new ErrorHandler(message, 400);
    }

    // Send error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

module.exports = errorhandle;
