const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const userController = require('../controllers/user_controller')
const customerController = require('../controllers/customer_controller')
const searchController = require('../controllers/search_controller')

router.get('/', userController.isLogged, (req, res) => {
  if (res.isLogged) {
    res.render('index', { user: res.data })
  } else {
    res.redirect('/signin')
  }
})

router.get('/@:username', userController.isLogged, userController.get, (req, res) => {
  // si está logueado
  // si el perfil es el del usuario logueado
  if (res.isLogged) {
    if (res.userProfile === false) {
      res.status(404).render('404')
    } else {
      if (res.userProfile.username === res.data.username) {
        res.userProfile.active = true
      } else {
        res.userProfile.active = false
      }
      res.render('userProfile', { userProfile: res.userProfile, user: res.data })
    }
  } else {
    res.redirect('/signin')
  }
})

router.get('/cliente/:id', userController.isLogged, customerController.get, (req, res) => {
  if (res.isLogged) {
    if (res.customerData === false) {
      res.status(404).render('404')
    } else {
      res.render('customerProfile', { customer: res.customerData, user: res.data })
    }
  } else {
    res.redirect('/signin')
  }
})

// Rutas del registro de usuarios
router.get('/signup', userController.isLogged, (req, res) => {
  if (req.isLogged) {
    res.redirect('/')
  } else {
    res.render('signup')
  }
})
router.post('/signup', userController.signup)

// Rutas del inicio de sesión de usuarios
router.get('/signin/', userController.isLogged, (req, res) => {
  if (req.isLogged) {
    res.redirect('/')
  } else {
    let user
    req.query.user ? user = req.query.user : user = ''
    res.render('signin', {user})
  }
})

router.post('/signin', userController.signin)

// Ruta del cierre de sesión de los usuarios
router.get('/signout/:username', userController.signout, (req, res) => {

})

// Rutas para la búsqueda
router.post('/search', searchController.search)
router.post('/cliente', customerController.update)

// Definimos los errores 404
router.get('*', (req, res) => {
  res.status(404).render('404')
})


module.exports = router