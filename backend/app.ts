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

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE"],
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