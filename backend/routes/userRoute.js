const express = require('express')
const { registerEmployee, loginUserAsEmployee, loginUserAsAdmin, LogoutUser } = require('../controllers/userController')

const router = express.Router()

router.post("/register" , registerEmployee)
router.post("/user/login",loginUserAsEmployee)
router.post("/admin/login",loginUserAsAdmin)
router.get("/logout",LogoutUser)

exports.router = router