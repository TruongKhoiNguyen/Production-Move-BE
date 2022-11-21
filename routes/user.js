const express = require('express')
const { testCreate, registerUser, loginUser, testLogin } = require('../controllers/userController')
const { protectRoute, authenticateToken } = require('../auth/project')
const passport = require('passport')

const router = express.Router()

router.get('/test', testCreate)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/login/test', authenticateToken, testLogin)

module.exports = router