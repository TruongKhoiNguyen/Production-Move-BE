const express = require('express')
const warrantyController = require('../controllers/warranty_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/send', checkRole(['warranty']), warrantyController.send)

module.exports = router