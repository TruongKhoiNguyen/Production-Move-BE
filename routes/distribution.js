const express = require('express')
const distributionController = require('../controllers/distribution_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/sales', checkRole(['distribution']), distributionController.sell)
router.post('/return-customer', checkRole(['distribution']), distributionController.returnToCustomer)
router.post('/receive', checkRole(['distribution']), distributionController.receiveProduct)
router.post('/recall', checkRole(['distribution']), distributionController.recall)
router.post('/return-factory', checkRole(['distribution']), distributionController.returnToFactory)

router.get('/sales', checkRole(['distribution']), distributionController.getSale)

module.exports = router