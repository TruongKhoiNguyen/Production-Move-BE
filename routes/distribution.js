const express = require('express')
const distributionController = require('../controllers/distribution_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/repair', checkRole(['distribution']), distributionController.sendForRepair)
router.post('/return', checkRole(['distribution']), distributionController.returnToFactory)
router.post('/sales', checkRole(['distribution']), distributionController.sell)
router.post('/return-customer', checkRole(['distribution']), distributionController.returnToCustomer)
router.post('/receive', checkRole(['distribution']), distributionController.receiveProduct)

module.exports = router