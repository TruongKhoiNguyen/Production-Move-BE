const express = require('express')

const user = require('./user')
const product = require('./product')
const userController = require('../controllers/users_controller')

const { authenticateToken } = require('../auth/project')

const router = express.Router()

router.use('/users', authenticateToken, user)
router.use('/products', authenticateToken, product)
router.post('/login', userController.login)

module.exports = router