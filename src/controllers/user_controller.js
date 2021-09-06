
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user_model')

const signup = async req => {
  try {
    console.log(req.post.password)
    let username = req.post.email.substr(0, req.post.email.indexOf('@'))
    const data = {
      fullName: req.post.fullName,
      username: username,
      email: req.post.email,
      password: await bcryptjs.hash(req.post.password, 8),
    }

    return await userModel.create(data)
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
      console.log(results[0].password)
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

    } catch (error) {
      console.log(error)
      return next()
    }
  } else {
    res.redirect('/signin')
  }
}

module.exports = { signup, signin, isLogged }