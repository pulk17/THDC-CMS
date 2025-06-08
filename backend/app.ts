import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// @ts-ignore
import errorMiddleware from './middleware/error';

// Import routes
// @ts-ignore
import userRoutes from './routes/userRoute';
// @ts-ignore
import complaintRoutes from './routes/complaintRoute';

const app: Express = express();

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
app.get('/test', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API is working!'
  });
});

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", complaintRoutes);

// Error handling middleware
app.use(errorMiddleware);

export default app; 