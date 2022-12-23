const express = require('express')
const userController = require('../controllers/users_controller')
const warehousesController = require('../controllers/warehouses_controller')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/', userController.getAll)
router.get('/:userId/warehouses', warehousesController.getWarehousesByUser)

module.exports = router