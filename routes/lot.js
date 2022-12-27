const express = require('express')
const lotsController = require('../controllers/lots_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.get('/:lot_number', lotsController.get)

module.exports = router