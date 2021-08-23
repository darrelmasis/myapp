const express = require('express')
const userController = require('../controllers/user-controller')
const router = express.Router()

// index
router.get('index', userController.read)


module.exports = router
