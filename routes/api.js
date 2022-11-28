const express = require('express')

const user = require('./user')
const warehouse = require('./warehouse')
const customer = require('./customer')
const product = require('./product')

const router = express.Router()

router.use('/users', user)
router.use('/warehouses', warehouse)
router.use('/customers', customer)
router.use('/products', product)

module.exports = router