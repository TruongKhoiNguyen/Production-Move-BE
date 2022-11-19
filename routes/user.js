const express = require('express')
const { testCreate } = require('../controllers/userController')
const router = express.Router()

router.get('/test', testCreate)

module.exports = router