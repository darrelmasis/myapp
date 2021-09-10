
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

    const results = userModel.create(user)

    if(!results) {
      response.type = 'error'
      response.message = 'Error en la consulta'
      return response
    } else {
      response.type = 'ok'
      response.message = 'Usuario registrado con éxito'
      return response
    }

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

    let response

    if (user.username === '' || user.password === '') {
      // Cuando los campos están vacíos
      return 'Todos los campos son obligatorios'
    } else {
      // Cuando los campos son incorrectos
      const results = await userModel.signin(user)
      if (results.length > 0) {
        if (!(await bcryptjs.compare(user.password, results[0].password))) {
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