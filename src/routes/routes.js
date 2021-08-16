const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

// User Routes
router.get('/', userController.read)


module.exports = router
