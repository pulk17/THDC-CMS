# THDC Complaint Management System - Frontend

This is the frontend application for the THDC Complaint Management System, built with React, TypeScript, Redux, and Tailwind CSS.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Directory Structure](#directory-structure)
- [Setup and Installation](#setup-and-installation)
- [Key Features](#key-features)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Authentication Flow](#authentication-flow)
- [Routing](#routing)
- [Styling](#styling)
- [Deployment](#deployment)
- [File Details](#file-details)

## Architecture Overview

The frontend application follows a component-based architecture using React and TypeScript. Key architectural elements include:

- **Component-Based Structure**: UI is broken down into reusable components
- **Redux State Management**: Centralized state management for application data
- **React Router**: Client-side routing for navigation
- **Axios**: HTTP client for API communication
- **TypeScript**: Static typing for improved code quality
- **Tailwind CSS**: Utility-first CSS framework for styling

## Directory Structure

```
frontend/
├── public/                # Static files
├── src/                   # Source code
│   ├── api/               # API configuration and services
│   │   ├── axios.ts       # Axios configuration
│   │   └── config.ts      # API endpoints
│   ├── assets/            # Images, fonts, etc.
│   ├── Components/        # React components
│   │   ├── AdminDashboard/    # Admin-specific components
│   │   ├── EmployeeDashboard/ # Employee-specific components
│   │   ├── Screen/            # Screen components (pages)
│   │   └── context/           # React context providers
│   ├── Redux/             # Redux state management
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   └── store.ts       # Redux store configuration
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Root component
│   └── index.tsx          # Application entry point
├── .env.production        # Production environment variables
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:6050
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Key Features

### User Authentication

- User registration and login
- Role-based access control (user, employee, admin)
- JWT token-based authentication
- Persistent login with token storage

### Complaint Management

- Submit new complaints with details and priority
- Track complaint status and history
- View assigned workers for complaints
- Filter and search complaints

### Admin Dashboard

- User management
- Worker assignment
- System-wide analytics
- Configuration settings

### Employee Dashboard

- View and manage complaints
- Assign complaints to workers
- Update complaint status
- Filter complaints by various criteria

## Component Hierarchy

```
App
├── AuthContext
│   ├── LoginScreen
│   └── RegisterScreen
├── UserDashboard
│   ├── ComplaintForm
│   ├── ComplaintList
│   └── ComplaintDetails
├── EmployeeDashboard
│   ├── ComplaintManagement
│   ├── WorkerAssignment
│   └── StatusUpdates
└── AdminDashboard
    ├── UserManagement
    ├── WorkerManagement
    └── SystemSettings
```

## State Management

The application uses Redux for state management:

### Store Structure

```
{
  auth: {
    user: { id, name, email, role },
    isAuthenticated: boolean,
    loading: boolean,
    error: string
  },
  complaints: {
    complaints: Array<Complaint>,
    complaint: Complaint | null,
    loading: boolean,
    error: string
  },
  workers: {
    workers: Array<Worker>,
    loading: boolean,
    error: string
  }
}
```

### Key Reducers

- **authReducer**: Manages authentication state
- **complaintReducer**: Manages complaint data
- **workerReducer**: Manages worker data

### Actions

- **Auth Actions**: login, register, logout, loadUser
- **Complaint Actions**: createComplaint, getComplaints, updateStatus
- **Worker Actions**: getWorkers, assignWorker

## API Integration

API communication is handled through Axios:

### API Configuration

- **axios.ts**: Configures Axios instance with:
  - Base URL from environment variables
  - Request/response interceptors
  - Authentication header injection
  - Error handling

- **config.ts**: Defines API endpoints as constants

### Error Handling

- Global error handling for API requests
- Authentication error redirection
- User-friendly error messages

## Authentication Flow

1. **Login/Registration**:
   - User submits credentials
   - Backend validates and returns JWT token
   - Token is stored in localStorage and cookies

2. **Request Authentication**:
   - Axios interceptor adds token to request headers
   - Protected routes check authentication status

3. **Token Expiration**:
   - Unauthorized responses trigger logout
   - User is redirected to login page

4. **Persistent Login**:
   - Token is checked on application startup
   - User session is restored if valid token exists

## Routing

The application uses React Router for navigation:

- **Public Routes**: Login, Register, Landing page
- **User Routes**: Dashboard, Submit Complaint, View Complaints
- **Employee Routes**: Complaint Management, Worker Assignment
- **Admin Routes**: User Management, System Settings

## Styling

The application uses Tailwind CSS for styling:

- **Utility-First Approach**: Component styling using utility classes
- **Responsive Design**: Mobile-first responsive layouts
- **Custom Theme**: Brand colors and typography
- **Component Styling**: Consistent styling across components

## Deployment

The frontend is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the project:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
3. Add environment variables:
   - `REACT_APP_API_URL`: URL of your backend API

## File Details

### `src/index.tsx`

The application entry point that:
- Renders the root React component
- Sets up Redux Provider
- Configures React Router

### `src/App.tsx`

The root component that:
- Sets up the main application layout
- Configures routes and protected routes
- Handles authentication state checking
- Provides global context providers

### `src/api/axios.ts`

Configures Axios for API communication:
- Sets base URL from environment variables
- Adds authentication token to requests
- Handles API errors and authentication redirects
- Implements request/response interceptors

### `src/api/config.ts`

Defines API endpoints as constants:
- Authentication endpoints
- Complaint management endpoints
- User management endpoints

### `src/Redux/store.ts`

Configures the Redux store:
- Combines reducers
- Sets up middleware
- Configures Redux DevTools
- Exports typed hooks for state access

### `src/Components/Screen/LoginScreen.tsx`

Handles user authentication:
- Login form with validation
- Error handling
- Redirect on successful login
- Remember me functionality

### `src/Components/Screen/RegisterScreen.tsx`

Handles user registration:
- Registration form with validation
- Role selection
- Admin code for admin registration
- Error handling

### `src/Components/Screen/Dashboard.tsx`

Main dashboard component that:
- Shows different views based on user role
- Loads user data on mount
- Handles navigation between dashboard sections

### `src/Components/AdminDashboard/`

Components for the admin dashboard:
- User management
- Worker management
- System settings
- Analytics and reporting

### `src/Components/EmployeeDashboard/`

Components for the employee dashboard:
- Complaint management
- Worker assignment
- Status updates
- Filtering and searching

### `src/Components/context/`

React context providers:
- Authentication context
- Theme context
- Notification context

### `src/types/`

TypeScript type definitions:
- User types
- Complaint types
- API response types
- Redux state types 