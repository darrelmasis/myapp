const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const userController = require('../controllers/user_controller')
const customerController = require('../controllers/customer_controller')

router.get('/',userController.isLogged, (req, res) => {
  res.render('index', {user: req.user})
})

router.get('/@:username',userController.isLogged, userController.get, (req, res) => {
  if(req.user === false) {
    res.status('404').render('404')
  } else {
    res.send('Perfil de usuario de: ' + req.user.fullName)
  }
})

router.get('/cliente/:id', userController.isLogged, customerController.get, (req, res) => {
  res.render('profile', {customer: req.customer, user: req.user})
})

router.get('/signup', (req, res) => {
  res.render('signup')
})

router.get('/signin',userController.isLogged, (req, res) => {
  res.render('signin')
})


router.get('/signout', userController.signout)
router.post('/signin', userController.signin)
router.post('/signup', userController.signup)

// Definimos los errores 404
router.get('*', (req, res) => {
  res.status(404).render('404')
})


module.exports = router