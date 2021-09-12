const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user_model')
const { promisify } = require('util')
let response = {}

const signup = async (req, res) => {
  try {
    const user = {
      fullName: req.body.fullName,
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: await bcryptjs.hash(req.body.password, 8),
      gender: req.body.gender,
      createTime: new Date()
    }
    const exist = await userModel.exist(user.email)
    if (exist) {
      response.type = 'error'
      response.message = `El correo <span class="fw-bold">${user.email}</span> ya está asociado a una cuenta`
      return res.send(response)
    } else {

      if (user.fullName === '' || user.username === '' || user.email === '' || user.password === '' || user.gender === '') {
        response.type = 'error'
        response.message = 'Todos los campos son obligatorios'
        return res.send(response)
      } else {
        if (req.body.password === '') {
          response.type = 'error'
          response.message = 'Las contraseñas no coinciden'
          return res.send(response)
        }
        userModel.create(user)
        response.type = 'success'
        response.message = 'Usuario registrado correctamente'
        return res.send(response)
      }
    }

  } catch (error) {
    console.log('Error: ' + error)
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al registrar el usuario'
    return res.send(response)
  }
}

const signin = async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password
    }

    if (user.username === '' || user.password === '') {
      response.type = 'empty'
      response.message = 'Todos los campos son obligatorios'
      return res.send(response)
    } else {
      const exist = await userModel.exist(user.username)
      if (!exist) {
        response.type = 'error'
        response.message = `El usuario <span class="fw-bold">${user.username}</span> no está asociado a ninguna cuenta`
        return res.send(response)
      } else {
        const results = await userModel.signin(user)
        if (!(await bcryptjs.compare(user.password, results.password))) {
          response.type = 'error'
          response.message = 'Usuario o contraseña inconrrecto'
          return res.send(response)
        } else {
          const id = results.id
          const token = jwt.sign({ id: id }, 'super_secret', { expiresIn: '7d' })
          const cookiesOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
          }
          res.cookie('jwt', token, cookiesOptions)
          response.type = 'success'
          response.message = 'Iniciando sesión...'
          return res.send(response)
        }
      }
    }

  } catch (error) {
    console.log('Error: ' + error)
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al iniciar sesión'
    return res.send(response)
  }
}

const isLogged = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const id = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
      userModel.isLogged(id.id).then(data => {
        data.firstname = data.fullName.split(' ')[0]
        req.user = data
        req.isLogged = true
        return next()
      })

    } catch (error) {
      console.log(error)
      return next()
    }
  } else {
    req.isLogged = false
    return next()
  }
}

const get = async (req, res, next) => {
  try {
    await userModel.read(req.params.username)
      .then(data => {
        console.log(data)
        if (data.length === 0) {
          req.user = false
          return next()
        } else {
          req.user = data
          return next()
        }
      })
  } catch (error) {
    return error
  }
}

const signout = (req, res) => {
  res.clearCookie('jwt')
  res.redirect('/')
}

module.exports = { signup, signin, isLogged, get, signout }