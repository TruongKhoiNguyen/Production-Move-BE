const express = require('express')
const modelsController = require('../controllers/models_controller')
const productionController = require('../controllers/production_controller')
const productsController = require('../controllers/products_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.get('/models', modelsController.getAll)
router.post('/models', checkRole(['executive']), modelsController.create)

router.post('/', checkRole(['production']), productionController.manufacture)

router.post('/shippings', checkRole(['production']), productsController.send)
router.get('/shippings', checkRole(['distribution']), productsController.getShippings)

router.post('/shippings/:delivery_id', productsController.receiveOrder)

router.post('/sales', checkRole(['distribution']), productsController.sell)

router.post('/repairing', checkRole(['distribution']), productsController.receiveForRepairing)
router.post('/recall', checkRole(['distribution']), productsController.recall)

module.exports = router