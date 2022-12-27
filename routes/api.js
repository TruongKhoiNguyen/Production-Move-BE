const express = require('express')

const user = require('./user')
const product = require('./product')
const distribution = require('./distribution')
const warranty = require('./warranty')
const logistics = require('./logistics')
const storage = require('./storage')
const customer = require('./customer')
const lot = require('./lot')
const userController = require('../controllers/users_controller')

const { authenticateToken } = require('../auth/project')

const router = express.Router()

router.use('/users', authenticateToken, user)
router.use('/products', authenticateToken, product)
router.use('/distribution', authenticateToken, distribution)
router.use('/warranty', authenticateToken, warranty)
router.use('/logistics', authenticateToken, logistics)
router.use('/storages', authenticateToken, storage)
router.use('/customers', authenticateToken, customer)
router.use('/lots', authenticateToken, lot)
router.post('/login', userController.login)

module.exports = router