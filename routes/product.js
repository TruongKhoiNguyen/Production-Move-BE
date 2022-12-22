const express = require('express')
const modelsController = require('../controllers/models_controller')

const router = express.Router()

router.get('/models', modelsController.getAll)
router.post('/models', modelsController.create)

module.exports = router