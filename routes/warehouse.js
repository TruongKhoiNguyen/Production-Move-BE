const express = require('express')

const controller = require('../controllers/warehouses_controller')

const router = express.Router()


router.get('/', controller.getAll)
router.post('/create', controller.create)


module.exports = router