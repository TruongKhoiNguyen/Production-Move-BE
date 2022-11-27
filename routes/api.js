const express = require('express')

const user = require('./user')
const warehouse = require('./warehouse')

const router = express.Router()

router.use('/users', user)
router.use('/warehouses', warehouse)

module.exports = router