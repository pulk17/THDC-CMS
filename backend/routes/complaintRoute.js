const express = require('express')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const { registerComplaint, getAllComplaintOfEmployee, getNewComplaints, getComplaintDetails, getPendingComplaints, getAllWorkers, getAllComplaints, assignComplaintToWorkers, findArrivedComplaint, changeStatusOfComplaint, filterComplaint } = require('../controllers/ComplaintController')

const router = express.Router()

router.post('/registerComplaint',isAuthenticatedUser,registerComplaint)


//get all complaints of a user:-
router.get('/myComplaints',isAuthenticatedUser,getAllComplaintOfEmployee)
//get the details of one complaint
router.get('/getComplaintDetails/:id' , isAuthenticatedUser,getComplaintDetails)
router.get('/getAllAssignedComplaint' , isAuthenticatedUser,findArrivedComplaint)
router.put('/changeStatusOfComplaint' , isAuthenticatedUser,changeStatusOfComplaint)


//admin Routes:-
router.get('/admin/getNewComplaint',isAuthenticatedUser,authorizeRoles("admin"),getNewComplaints)
router.get('/admin/getPendingComplaint',isAuthenticatedUser,authorizeRoles("admin"),getPendingComplaints)
router.get('/admin/getWorkerList',isAuthenticatedUser,authorizeRoles("admin"),getAllWorkers)
router.get('/admin/getAllComplaints',isAuthenticatedUser,authorizeRoles("admin"),getAllComplaints)
router.put('/admin/assignComplaintToWorkers',isAuthenticatedUser,authorizeRoles("admin"),assignComplaintToWorkers)
router.post('/admin/filterComplaints',isAuthenticatedUser,authorizeRoles("admin"),filterComplaint)

module.exports = router;

