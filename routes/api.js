const express = require('express')

const user = require('./user')
const product = require('./product')
const userController = require('../controllers/users_controller')

const { authenticateToken } = require('../auth/project')
const { test } = require('../controllers/debug_controller')

const router = express.Router()

router.use('/users', authenticateToken, user)
router.use('/products', authenticateToken, product)
router.post('/login', userController.login)
router.post('/debug', authenticateToken, test)

module.exports = router