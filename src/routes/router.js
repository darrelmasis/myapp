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

router.get('/signin', (req, res) => {

  // const id = results[0].id
  // const token = jwt.sign({ id: id }, 'super_secret', { expiresIn: '7d' })
  // const cookiesOptions = {
  //   expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  //   httpOnly: true
  // }
  // res.cookie('jwt', token, cookiesOptions)
  // res.redirect('/')
  console.log(req)
  res.render('signin')
})

router.post('/signin', (req, res) => {
})

// Definimos los errores 404
router.get('*', (req, res) => {
  res.status(404).render('404')
})


module.exports = router