const express = require('express')
const storagesController = require('../controllers/storages_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.get('/', storagesController.getAll)
router.get('/:storage_id', storagesController.get)

router.post('/', checkRole(['executive']), storagesController.create)

module.exports = router