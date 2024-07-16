const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this feature", 401));
    }
    if (token) {
        const JWT_SECRET = "KJGFSDJKGJFDLKGJHFOIAHJSFKAJHKAJ";
        const decodedData = jwt.verify(token, JWT_SECRET);

        req.user = await User.findById(decodedData.id);

        next();
    }
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log("req used of auth",req.user)
        if (!roles.includes(req.user.employee_role)) {
            return next(new ErrorHandler(`Role: ${req.user.employee_role} is not allowed to use this resource`, 403));
        }
        next();
    };
};
