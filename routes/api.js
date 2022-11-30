const express = require('express')

const user = require('./user')
const warehouse = require('./warehouse')
const customer = require('./customer')
const product = require('./product')
const tracker = require('./tracker')
const manufacturing = require('./manufacturing')
const distributing = require('./distributing')
const sold = require('./sold')
const repairing = require('./repairing')
const defect = require('./defect')

const router = express.Router()

router.use('/users', user)
router.use('/warehouses', warehouse)
router.use('/customers', customer)
router.use('/products', product)
router.use('/trackers', tracker)

router.use('/status/manufacturing', manufacturing)
router.use('/status/distributing', distributing)
router.use('/status/sold', sold)
router.use('/status/repairing', repairing)
router.use('/status/defects', defect)

module.exports = router