import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import ErrorHandler from '../utils/errorhandler';

interface ErrorWithCode extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
}

const errorMiddleware = (
  err: ErrorWithCode,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const duplicateMessage = `Duplicate ${Object.keys(err.keyValue || {})} entered`;
    err = new ErrorHandler(duplicateMessage, 400);
  }

  // JsonWebToken error
  if (err.name === "JsonWebTokenError") {
    const jwtMessage = `Json web token is invalid. Please try again`;
    err = new ErrorHandler(jwtMessage, 400);
  }

  // JsonWebToken expired error
  if (err.name === "TokenExpiredError") {
    const expiredMessage = `Json web token is expired. Please try again`;
    err = new ErrorHandler(expiredMessage, 400);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorMiddleware; 