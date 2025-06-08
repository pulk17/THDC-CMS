# THDC Complaint Management System

A comprehensive complaint management system for THDC (Tehri Hydro Development Corporation) that allows users to register complaints, employees to manage and assign complaints to workers, and administrators to oversee the entire process.

![THDC CMS](https://via.placeholder.com/800x400?text=THDC+Complaint+Management+System)

## Live Demo

- **Frontend**: [https://thdc-cms.vercel.app](https://thdc-cms.vercel.app)
- **Backend API**: [https://thdc-cms-backend.onrender.com](https://thdc-cms-backend.onrender.com)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

The THDC Complaint Management System is designed to streamline the process of registering, tracking, and resolving complaints within the organization. The system provides different interfaces and functionalities for three types of users:

1. **Regular Users**: Can register and track their complaints
2. **Employees**: Can manage complaints, assign them to workers, and update their status
3. **Administrators**: Have complete control over the system, including user management

## Features

### For Users
- User registration and authentication
- Submit new complaints with details and priority
- Track complaint status and history
- View assigned workers for complaints
- Receive updates on complaint resolution

### For Employees
- Dashboard to view and manage all complaints
- Assign complaints to available workers
- Update complaint status (in progress, resolved, etc.)
- Filter and search complaints by various parameters

### For Administrators
- Complete user management (create, update, delete)
- Worker management
- System-wide analytics and reporting
- Configuration of system parameters

## Technology Stack

### Frontend
- React.js with TypeScript
- Redux for state management
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- JWT for authentication

### Deployment
- Frontend: Vercel
- Backend: Render.com
- Database: MongoDB Atlas

## Getting Started

To get started with the THDC Complaint Management System, you'll need:

1. Node.js (v18 or higher)
2. MongoDB (local or Atlas connection)
3. Git

## Local Development

Follow these steps to set up the project locally:

### Clone the Repository

```bash
git clone https://github.com/pulk17/THDC-CMS.git
cd THDC-CMS
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create config.env file with the following variables:
# PORT=6050
# MONGODB_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# ADMIN_REGISTRATION_CODE=your_admin_code

# Run development server
npm run dev
```

The backend server will start on http://localhost:6050.

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file (optional)
# REACT_APP_API_URL=http://localhost:6050

# Run development server
npm start
```

The frontend development server will start on http://localhost:3000.

## Deployment

### Backend Deployment (Render.com)

1. Fork or clone this repository
2. Connect to Render.com
3. Create a new Web Service
4. Use the following settings:
   - Build Command: `chmod +x render-build.sh && ./render-build.sh`
   - Start Command: `npm start`
5. Add the required environment variables

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure the project:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add the environment variable `REACT_APP_API_URL` pointing to your backend URL
4. Deploy

## Non-Technical Breakdown

The THDC Complaint Management System is like a digital help desk for the organization. Here's how it works:

1. **Registration and Login**: Users create accounts or log in to access the system.

2. **Filing a Complaint**: 
   - Users fill out a simple form describing their issue
   - They can specify details like location, department, and urgency
   - Once submitted, the complaint is registered in the system

3. **Complaint Processing**:
   - Employees see new complaints on their dashboard
   - They review each complaint and assign it to an appropriate worker
   - The worker receives notification about the assigned task

4. **Tracking and Updates**:
   - Users can check the status of their complaints anytime
   - They can see who is working on their issue
   - They receive updates when the status changes

5. **Resolution**:
   - Once the issue is fixed, the worker marks it as resolved
   - The user can verify if the resolution is satisfactory
   - If not, they can reopen the complaint

6. **Management and Oversight**:
   - Administrators can see all activities in the system
   - They can manage users, workers, and employees
   - They can generate reports to identify common issues or bottlenecks

This system replaces traditional paper-based complaint handling with a streamlined digital process, making it faster and more transparent for everyone involved.

## Project Structure

The project is organized into two main directories:

- `frontend/`: Contains the React.js application
- `backend/`: Contains the Node.js/Express API

For detailed information about each part:

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 