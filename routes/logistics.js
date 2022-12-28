const express = require('express')
const logisticsController = require('../controllers/logistics_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/:delivery_id', checkRole(['production', 'distribution', 'warranty']), logisticsController.receive)
router.post('/', checkRole(['production', 'distribution', 'warranty']), logisticsController.send)

router.get('/inbox', logisticsController.getInbox)
router.get('/sent', logisticsController.getSent)

module.exports = router