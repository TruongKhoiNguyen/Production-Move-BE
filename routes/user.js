const express = require('express')
const { testCreate, registerUser, loginUser, testLogin } = require('../controllers/userController')
const { protectRoute } = require('../auth/project')

const router = express.Router()

router.get('/test', testCreate)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/login/test', protectRoute, testLogin)

module.exports = router