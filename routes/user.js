const express = require('express')
const userController = require('../controllers/users_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/', checkRole(['executive']), userController.register)
router.get('/', userController.getAll)
router.get('/:user_id', userController.get)

module.exports = router