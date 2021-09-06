const express = require('express')
const router = express.Router()
const customer = require('../controllers/customer_controller')
const userController = require('../controllers/user_controller')
const bcrypt = require('bcryptjs')


// Vista inicial
router.get('/', (req, res) => {
  res.render('index')
})


// Vista del perfil de los clientes
router.get('/cliente/:id', (req, res) => {
  customer.get(req.params.id)
    .then(data => {
      customer.getSeller(data[0].seller)
        .then(dataSeller => {
          data[0].sellerInfo = dataSeller[0]
          data[0].dateFormat = d => {
            const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            let date = new Date(d)
            let day = date.getDate()
            day < 10 ? day = '0' + day : null
            let month = date.getUTCMonth()
            month < 10 ? month = '0' + month : null
            let year = date.getFullYear()

            return {
              day: day,
              month: month,
              year: year,
              short: day + '/' + month + '/' + year,
              large: days[date.getDay()] + ' ' + day + ' de ' + months[date.getMonth()] + ' de  ' + year
            }
          }
          res.render('profile', { customer: data[0] })
        })
    })
})

router.post('/save', (req, res) => {
  let post = req.body
  let data = {
    post: {
      fullName: post.fullName,
      bussinessName: post.bussinessName,
      address: post.address,
      primaryPhone: post.primaryPhone,
      secondaryPhone: post.secondaryPhone,
      primaryEmail: post.primaryEmail,
      secondaryEmail: post.secondaryEmail,
      type: post.type,
      payCondition: post.payCondition,
    },
    id: post.customerCode
  }
  customer.update(data)
  res.redirect('/cliente/' + data.id)
})

router.get('/registro', (req, res) => {
  res.render('register')
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/register', async (req, res) => {
  const data = {
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 8)
  }
   userController.register(data)
  res.send('registro')
})

router.post('/login', async (req, res) => {
  const data = {
    username: req.body.username,
    password: await bcrypt.hash(req.body.password, 8)
  }
   userController.login(data)
  res.send('Login')
})

module.exports = router