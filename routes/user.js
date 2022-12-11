const express = require('express')
const userController = require('../controllers/users_controller')

const router = express.Router()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/', userController.getAll)

module.exports = router