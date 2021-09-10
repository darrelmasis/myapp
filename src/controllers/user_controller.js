const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user_model')
const { promisify } = require('util')
let response = {}

const signup = async data => {
  try {
    const user = {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: await bcryptjs.hash(data.password, 8),
    }

    userModel.create(user)
    response.type = 'success'
    response.message = 'Usuario registrado con éxito'
    return response

  } catch (error) {
    console.log('Error: ' + error)
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al registrar el usuario'
    return response
  }
}

const signin = async data => {
  try {
    const user = {
      username: data.username || '',
      password: data.password
    }

    if (user.username === '' || user.password === '') {
      response.type = 'empty'
      response.message = 'Todos los campos son obligatorios'
      return response
    } else {
      const results = await userModel.signin(user)
      if (results.length > 0) {
        if (!(await bcryptjs.compare(user.password, results[0].password))) {
          response.type = 'error'
          response.message = 'Usuario o contraseña inconrrecto'
          return response
        } else {
          response.type = 'success'
          response.message = 'Iniciando sesión...'
          return response
        }
      } else {
        response.type = 'error'
        response.message = `El usuario <span class="fw-bold">${user.username}</span> no está asociado a ninguna cuenta`
        return response
      }
    }

  } catch (error) {
    console.log('Error: ' + error)
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al iniciar sesión'
    return response
  }
}

const signinComplete = (req, res) => {
  
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