# THDC Complaint Management System - Backend

This is the backend API for the THDC Complaint Management System.

## Deployment Instructions

### Local Development

1. Install dependencies:
   ```
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
   ```
   npm run dev
   ```

### Production Deployment on Render.com

1. Fork or clone this repository
2. Connect to Render.com
3. Create a new Web Service
4. Use the following settings:
   - Build Command: `chmod +x render-build.sh && ./render-build.sh`
   - Start Command: `npm start`
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URL`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `ADMIN_REGISTRATION_CODE`: Your admin registration code

## API Endpoints

- `GET /test`: Test if the API is working
- `POST /api/v1/login`: User login
- `GET /api/v1/logout`: User logout
- Various complaint management endpoints under `/api/v1/` 