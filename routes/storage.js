const express = require('express')
const storagesController = require('../controllers/storages_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.get('/', storagesController.getAll)

module.exports = router