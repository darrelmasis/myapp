
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user_model')
const { promisify } = require('util')

const signup = async (req, res) => {
  try {
    let username = req.body.email.substr(0, req.body.email.indexOf('@'))
    const data = {
      fullName: req.body.firstName + ' ' + req.body.lastName,
      username: username,
      email: req.body.email,
      password: await bcryptjs.hash(req.body.password, 8),
    }

    return res.redirect('/signin')
  } catch (error) {
    console.log(error)
  }
}

const signin = async (req, res) => {
  try {
    const data = {
      username: req.body.username || '',
      password: req.body.password
    }

    if (data.username === '' || data.password === '') {
      // Cuando los campos están vacíos
      return 'Todos los campos son obligatorios'
    } else {
      // Cuando los campos son incorrectos
      const results = await userModel.signin(data)
      if (results.length > 0) {
        if (!(await bcryptjs.compare(data.password, results[0].password))) {
          console.log(await bcryptjs.compare('dmasis1996', results[0].password))
          console.log('Usuario y/o contraseña incorrecta')

        } else {
          const id = results[0].id
          const token = jwt.sign({ id: id }, 'super_secret', { expiresIn: '7d' })
          const cookiesOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
          }
          res.cookie('jwt', token, cookiesOptions)
          res.redirect('/')
        }
      } else {
        console.log('El usuario no existe')
      }
    }

  } catch (error) {
    console.log(error)
  }
}


const isLogged = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const id = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
      userModel.isLogged(id.id).then(data => {
        data[0].firstname = data[0].fullName.split(' ')[0]
        req.user = data[0]
        req.isLogged = true
        return next()
      })

    } catch (error) {
      console.log(error)
      return next()
    }
  } else {
    res.redirect('/signin')
  }
}

const get = async (req, res, next) => {
  try {
    await userModel.read(req.params.username)
      .then(async data => {
        if (data.length === 0) {
          req.user = false
          return next()
        } else {
          return next()
        }
      })
  } catch (error) {
    console.log(error);
  }
}

const signout = (req, res) => {
  res.clearCookie('jwt')
  res.redirect('/')
}

module.exports = { signup, signin, isLogged, get, signout }