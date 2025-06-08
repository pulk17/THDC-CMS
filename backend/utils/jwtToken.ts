import { Response } from 'express';
import { Document } from 'mongoose';

interface UserDocument extends Document {
  getJWTToken: () => string;
}

const sendToken = (user: UserDocument, statusCode: number, res: Response): void => {
  const token = user.getJWTToken();

  // Set cookie expiry to 2 days (in milliseconds)
  const twoDay = 2 * 24 * 60 * 60 * 1000;

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + twoDay),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token
  });
};

export default sendToken; 