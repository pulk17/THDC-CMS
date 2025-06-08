# THDC Complaint Management System - Backend

This is the backend API for the THDC Complaint Management System, built with Node.js, Express, TypeScript, and MongoDB.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Setup and Installation](#setup-and-installation)
- [API Endpoints](#api-endpoints)
- [Authentication and Authorization](#authentication-and-authorization)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Controllers](#controllers)
- [Utilities](#utilities)
- [Deployment](#deployment)
- [Error Handling](#error-handling)

## Architecture Overview

The backend follows the MVC (Model-View-Controller) architecture pattern:

- **Models**: Define the database schema and business logic for data entities
- **Controllers**: Handle incoming requests, process data, and send responses
- **Routes**: Define API endpoints and connect them to controllers
- **Middleware**: Provide cross-cutting functionality like authentication and error handling
- **Utils**: Contain helper functions and utilities used across the application

## Directory Structure

```
backend/
├── app.ts                 # Express application setup
├── server.ts              # Server entry point
├── config.env             # Environment variables
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── render.yaml            # Render.com deployment configuration
├── render-build.sh        # Build script for Render.com
├── deploy.js              # JavaScript fallback for deployment
├── build.js               # Build script
├── controllers/           # Request handlers
│   ├── ComplaintController.ts
│   └── UserController.ts
├── models/                # Database schemas
│   ├── complaintModel.ts
│   └── userModel.ts
├── routes/                # API routes
│   ├── complaintRoute.ts
│   └── userRoute.ts
├── middleware/            # Middleware functions
│   ├── auth.ts
│   ├── catchAsyncError.ts
│   └── error.ts
└── utils/                 # Utility functions
    ├── errorhandler.ts
    └── jwtToken.ts
```

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas connection)

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `config.env` file with the following variables:
   ```
   PORT=6050
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ADMIN_REGISTRATION_CODE=your_admin_code
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/v1/register`: Register a new user
  - Body: `{ name, email, password, role }`
  - Role can be "user", "employee", or "admin" (admin requires registration code)

- `POST /api/v1/login`: User login
  - Body: `{ email, password }`
  - Returns JWT token in cookie

- `GET /api/v1/logout`: User logout
  - Clears authentication cookie

### User Management

- `GET /api/v1/me`: Get current user profile
- `PUT /api/v1/update-profile`: Update user profile
- `PUT /api/v1/update-password`: Update user password
- `GET /api/v1/get-all-workers`: Get all workers (employee/admin only)

### Complaint Management

- `POST /api/v1/register-complaint`: Register a new complaint
  - Body: `{ title, description, priority, location }`

- `GET /api/v1/get-all-my-complaints`: Get all complaints by current user

- `GET /api/v1/get-all-employee-complaints`: Get all complaints (employee/admin only)

- `GET /api/v1/find-arrived-complaints`: Get newly arrived complaints (employee/admin only)

- `PUT /api/v1/assign-complaint-to-worker/:id`: Assign complaint to worker
  - Body: `{ workerId, workerName }`

- `PUT /api/v1/change-status-of-complaint/:id`: Update complaint status
  - Body: `{ status }`

- `GET /api/v1/filter-complaints`: Filter complaints by various parameters
  - Query params: `status`, `priority`, `worker`, etc.

## Authentication and Authorization

Authentication is implemented using JSON Web Tokens (JWT). The system has three user roles:

1. **User**: Regular users who can register complaints and view their own complaints
2. **Employee**: Can manage complaints, assign them to workers, and update their status
3. **Admin**: Has full access to all features and can manage users

The authentication flow works as follows:

1. User logs in with email and password
2. Server validates credentials and generates a JWT token
3. Token is sent to the client in an HTTP-only cookie
4. For subsequent requests, the token is extracted from the cookie or Authorization header
5. Middleware verifies the token and attaches the user to the request object

## Database Models

### User Model (`models/userModel.ts`)

The User model defines the schema for users in the system:

```typescript
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
  getJWTToken(): string;
}
```

Key features:
- Password hashing using bcrypt
- Method to compare passwords for authentication
- Method to generate JWT tokens
- Pre-save hook to hash passwords

### Complaint Model (`models/complaintModel.ts`)

The Complaint model defines the schema for complaints in the system:

```typescript
interface IComplaint extends Document {
  title: string;
  description: string;
  status: string;
  priority: string;
  location: string;
  user: IUser | Schema.Types.ObjectId;
  worker: {
    id?: Schema.Types.ObjectId;
    name?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

Key features:
- Reference to user who created the complaint
- Worker assignment information
- Status tracking (pending, in-progress, resolved)
- Priority levels (low, medium, high)

## Middleware

### Authentication Middleware (`middleware/auth.ts`)

This middleware handles authentication and role-based authorization:

- `isAuthenticated`: Verifies JWT token and attaches user to request
- `authorizeRoles`: Restricts access based on user roles

### Error Handling Middleware (`middleware/error.ts`)

Centralized error handling middleware that:
- Formats error responses
- Handles different types of errors (validation, authentication, etc.)
- Provides appropriate HTTP status codes

### Async Error Handler (`middleware/catchAsyncError.ts`)

A utility middleware that wraps controller functions to handle async errors without try-catch blocks.

## Controllers

### User Controller (`controllers/UserController.ts`)

Handles user-related operations:
- User registration and login
- Profile management
- Password updates
- User listing (for admins)

### Complaint Controller (`controllers/ComplaintController.ts`)

Handles complaint-related operations:
- Creating new complaints
- Listing complaints (with filtering)
- Assigning complaints to workers
- Updating complaint status
- Filtering and searching complaints

## Utilities

### JWT Token Utility (`utils/jwtToken.ts`)

Handles JWT token generation and cookie settings:
- Generates tokens with user ID payload
- Sets secure HTTP-only cookies
- Configures token expiration

### Error Handler (`utils/errorhandler.ts`)

Custom error class for consistent error handling across the application.

## Deployment

### Render.com Deployment

The backend is configured for deployment on Render.com using:

1. `render.yaml`: Defines the service configuration
2. `render-build.sh`: Build script that:
   - Installs dependencies
   - Attempts TypeScript compilation
   - Falls back to JavaScript if compilation fails
   - Sets up environment variables

3. `deploy.js`: JavaScript fallback version of the server for when TypeScript compilation fails

### Environment Variables for Production

- `NODE_ENV`: `production`
- `PORT`: `10000`
- `MONGODB_URL`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `ADMIN_REGISTRATION_CODE`: Code required for admin registration

## Error Handling

The application implements a comprehensive error handling strategy:

1. **Custom Error Class**: `utils/errorhandler.ts` provides a consistent error format
2. **Async Error Wrapper**: `middleware/catchAsyncError.ts` catches errors in async functions
3. **Global Error Handler**: `middleware/error.ts` processes all errors centrally
4. **Validation Errors**: Mongoose validation errors are properly formatted
5. **HTTP Status Codes**: Appropriate status codes are used for different error types

## File Details

### `app.ts`

Sets up the Express application:
- Configures middleware (CORS, body parser, cookie parser)
- Mounts API routes
- Sets up global error handler

### `server.ts`

The entry point of the application:
- Loads environment variables
- Connects to MongoDB
- Starts the HTTP server
- Sets up global error handlers for uncaught exceptions

### `build.js`

A Node.js script that:
- Cleans the dist directory
- Installs TypeScript type definitions
- Attempts to compile TypeScript code
- Falls back to JavaScript if compilation fails

### `deploy.js`

A simplified JavaScript version of the server that:
- Sets up basic Express routes
- Connects to MongoDB
- Provides minimal functionality for deployment
- Used as a fallback when TypeScript compilation fails

### `render-build.sh`

A bash script for Render.com deployment that:
- Installs dependencies
- Installs TypeScript globally
- Installs type definitions
- Attempts TypeScript compilation
- Falls back to JavaScript if compilation fails

### `render.yaml`

Defines the Render.com service configuration:
- Service type and name
- Environment (Node.js)
- Repository and branch
- Build and start commands
- Environment variables 