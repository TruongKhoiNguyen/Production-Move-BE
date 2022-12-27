const express = require('express')
const logisticsController = require('../controllers/logistics_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/:delivery_id', checkRole(['production', 'distribution', 'warranty']), logisticsController.receive)

module.exports = router