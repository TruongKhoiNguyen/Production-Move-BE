const express = require('express')
const modelsController = require('../controllers/models_controller')
const productionController = require('../controllers/production_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.get('/models', modelsController.getAll)
router.post('/models', checkRole(['executive']), modelsController.create)

router.post('/', productionController.manufacture)

module.exports = router