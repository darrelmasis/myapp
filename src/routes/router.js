const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const userController = require('../controllers/user_controller')
const customerController = require('../controllers/customer_controller')

router.get('/',userController.isLogged, (req, res) => {
  if (req.isLogged) {
    res.render('index', { user: req.user })
  } else {
    res.redirect('/signin')
  }
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

// Rutas del registro de usuarios
router.get('/signup',userController.isLogged,(req, res) => {
  if (req.isLogged) {
    res.redirect('/')
  } else {
    res.render('signup')
  }
})
router.post('/signup', userController.signup)

// Rutas del inicio de sesión de usuarios
router.get('/signin', userController.isLogged, (req, res) => {
  if(req.isLogged) {
    res.redirect('/')
  } else {
    res.render('signin')
  }
})
router.post('/signin', userController.signin)

// Ruta del cierre de sesión de los usuarios
router.get('/signout/:username', userController.signout, (req, res) => {

})

// Definimos los errores 404
router.get('*', (req, res) => {
  res.status(404).render('404')
})


module.exports = router