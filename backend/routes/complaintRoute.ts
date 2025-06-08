import express from 'express';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth';
import { 
  registerComplaint, 
  getComplaintDetails, 
  getComplaints,
  getAllWorkers, 
  assignComplaintToWorkers, 
  changeStatusOfComplaint, 
  filterComplaint 
} from '../controllers/ComplaintController';

const router = express.Router();

// Common routes for all authenticated users
router.post('/registerComplaint', isAuthenticatedUser, registerComplaint);
router.get('/complaints', isAuthenticatedUser, getComplaints);
router.get('/getComplaintDetails/:id', isAuthenticatedUser, getComplaintDetails);
router.put('/changeStatusOfComplaint', isAuthenticatedUser, changeStatusOfComplaint);

// Admin-only routes
router.get('/admin/getWorkerList', isAuthenticatedUser, authorizeRoles("admin"), getAllWorkers);
router.put('/admin/assignComplaintToWorkers', isAuthenticatedUser, authorizeRoles("admin"), assignComplaintToWorkers);
router.post('/admin/filterComplaints', isAuthenticatedUser, authorizeRoles("admin"), filterComplaint);

export default router; 