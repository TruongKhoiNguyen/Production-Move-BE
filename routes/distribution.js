const express = require('express')
const distributionController = require('../controllers/distribution_controller')
const { checkRole } = require('../auth/project')

const router = express.Router()

router.post('/repair', checkRole(['distribution']), distributionController.sendForRepair)

module.exports = router