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
        let results = await userModel.signin(user)
        results = results[0]
        if (!(await bcryptjs.compare(user.password, results.password))) {
          response.type = 'error'
          response.message = 'Usuario o contraseña inconrrecto'
          return res.send(response)
        } else {
          const id = results.id
          const token = jwt.sign({ id: id }, 'super_secret', { expiresIn: '365d' })
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
    console.log(error)
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al iniciar sesión'
    return res.send(response)
  }
}

const isLogged = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const id = await promisify(jwt.verify)(req.cookies.jwt, 'super_secret')
      await userModel.isLogged(id.id).then(data => {
        res.data = data[0]
        res.isLogged = true
        return next()
      })

    } catch (error) {
      console.log(error)
      return next()
    }
  } else {
    res.isLogged = false
    return next()
  }
}

const get = async (req, res, next) => {
  try {
    await userModel.read(req.params.username)
      .then(data => {
        if (data.length === 0) {
          res.userProfile = false
          return next()
        } else {
          res.userProfile = data[0]
          return next()
        }
      })
  } catch (error) {
    return error
  }
}

const signout = (req, res) => {
  res.clearCookie('jwt')
  res.redirect(`/signin?user=${req.params.username}`)
}

module.exports = { signup, signin, isLogged, get, signout }