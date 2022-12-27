const express = require('express')
const customerController = require('../controllers/customers_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.get('/', customerController.getAll)

module.exports = router