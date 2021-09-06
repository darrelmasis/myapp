const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const userController = require('../controllers/user_controller')

router.get('/',userController.isLogged, (req, res) => {
  
  res.render('index')
})

router.get('/@:username', (req, res) => {
  res.render('userProfile')
})

router.get('/cliente/:id', (req, res) => {
  res.render('customerProfile')
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.get('/signin', (req, res) => {
  res.render('signin')
})

router.post('/signin', userController.signin)

// Definimos los errores 404
router.get('*', (req, res) => {
  res.status(404).render('404')
})


module.exports = router