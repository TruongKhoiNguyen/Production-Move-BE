const express = require('express')

const user = require('./user')
const product = require('./product')
const distribution = require('./distribution')
const warranty = require('./warranty')
const logistics = require('./logistics')
const userController = require('../controllers/users_controller')

const { authenticateToken } = require('../auth/project')
const { test } = require('../controllers/debug_controller')

const router = express.Router()

router.use('/users', authenticateToken, user)
router.use('/products', authenticateToken, product)
router.use('/distribution', authenticateToken, distribution)
router.use('/warranty', authenticateToken, warranty)
router.use('/logistics', authenticateToken, logistics)
router.post('/login', userController.login)
router.post('/debug', authenticateToken, test)

module.exports = router