const express = require('express')
const userController = require('../controllers/users_controller')
const warehousesController = require('../controllers/warehouses_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/', checkRole(['executive']), userController.register)
router.get('/', userController.getAll)
router.get('/:userId/warehouses', warehousesController.getWarehousesByUser)
router.get('/warehouses', warehousesController.getAll)

module.exports = router