import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserDetails, 
  registerAdmin,
  getAllUsers,
  deleteUser,
  updateUser
} from '../controllers/UserController';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/admin/register", registerAdmin);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// User routes
router.get("/me", isAuthenticatedUser, getUserDetails);

// Admin routes for user management
router.get("/admin/getAllUsers", isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
router.delete("/admin/deleteUser/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.put("/admin/updateUser", isAuthenticatedUser, authorizeRoles("admin"), updateUser);

export default router; 