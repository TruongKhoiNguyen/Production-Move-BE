const express = require('express')

const user = require('./user')
const product = require('./product')

const router = express.Router()

router.use('/users', user)
router.use('/products', product)

module.exports = router