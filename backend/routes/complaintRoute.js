const express = require('express')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const { registerComplaint, getAllComplaintOfEmployee, getNewComplaints, getComplaintDetails, getPendingComplaints, getAllWorkers } = require('../controllers/complaintController')

const router = express.Router()

router.post('/registerComplaint',isAuthenticatedUser,registerComplaint)


//get all complaints of a user:-
router.get('/myComplaints',isAuthenticatedUser,getAllComplaintOfEmployee)
//get the details of one complaint
router.get('/getComplaintDetails/:id' , isAuthenticatedUser,getComplaintDetails)


//admin Routes:-
router.get('/admin/getNewComplaint',isAuthenticatedUser,authorizeRoles("admin"),getNewComplaints)
router.get('/admin/getPendingComplaint',isAuthenticatedUser,authorizeRoles("admin"),getPendingComplaints)
router.get('/admin/getWorkerList',isAuthenticatedUser,authorizeRoles("admin"),getAllWorkers)

module.exports = router;

