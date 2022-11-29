const express = require('express')

const user = require('./user')
const warehouse = require('./warehouse')
const customer = require('./customer')
const product = require('./product')
const tracker = require('./tracker')
const manufacturing = require('./manufacturing')
const distributing = require('./distributing')

const router = express.Router()

router.use('/users', user)
router.use('/warehouses', warehouse)
router.use('/customers', customer)
router.use('/products', product)
router.use('/trackers', tracker)

router.use('/status/manufacturing', manufacturing)
router.use('/status/distributing', distributing)

module.exports = router