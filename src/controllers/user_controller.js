const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user_model')
const { promisify } = require('util')
const multer = require('multer')
const fs = require('fs');  
const { async } = require('regenerator-runtime')
const cloudinary = require('cloudinary').v2
const mail = require('../models/mailer_model')
const cloudinaryConfig = {
  cloud_name: 'darrelmasis', 
  api_key: '956779834764534', 
  api_secret: '2I-HxI_MVDQ-kKlZ3tEyWS-4t9A' 
}
cloudinary.config(cloudinaryConfig)

let response = {}
let loginAttempts = 0

const signup = async (req, res) => {
  try {
    const user = {
      fullName: req.body.fullName,
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: await bcryptjs.hash(req.body.password, 8),
      gender: req.body.gender,
      avatar: 'avatar.png',
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
        let defaultAvatar = ''
        if (user.gender === 'Masculino') {
          defaultAvatar = 'male-avatar.png'
        } else {
          defaultAvatar = 'female-avatar.png'
        }
        await cloudinary.uploader.upload(`src/public/dist/assets/${defaultAvatar}`, { public_id: `${user.username}/avatar` }, (error, result) => {
          user.avatar = `v${result.version}/${result.public_id}.${ result.format }`
          userModel.create(user)
          response.type = 'success'
          response.message = 'Usuario registrado correctamente'
          return res.send(response)
        })
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
      password: req.body.password,
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
          loginAttempts++
          if (loginAttempts >= 3) {
            const data = {
              from: 'darrelmasis@gmail.com',
              to: results.email,
              subject: 'Incio de sesión',
              text: 'Hemos detectado que has tratado de iniciar sesión muchas veces',
              html: '<a href="https:/dm-myapp.herokuapp.com/reset-password">Restablecer Contraseña</a>'
            }
            mail.send(data).then(result => console.log(loginAttempts))
          }
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
          loginAttempts = 0
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
        res.data.cloud = `https://res.cloudinary.com/darrelmasis/image/upload` //url del cloud storage CDN
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
          data[0].cloud = `https://res.cloudinary.com/darrelmasis/image/upload` //url del cloud storage CDN
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

const update = async (req, res) => {
  try {
    const userData = {
      fullName: req.body.firstName + ' ' + req.body.lastName,
      gender: req.body.gender,
      email: req.body.email,
      bio: req.body.bio
    }
    const userId = req.body.userId

    userModel.update(userId,userData)
    response.type = 'success'
    response.message = 'Información actualizada correctamente'
    return res.send(response)
  } catch (error) {
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al actualizar la información'
    return res.send(response)
  }
}

let timeStamp = Date.now()
const memoryStorage = multer.memoryStorage()
const upload = multer({ memoryStorage })

const updateAvatar = async (req, res) => {
  try {
    const id = res.data.id
    console.log(req.body)
    await cloudinary.uploader.upload(req.body.userAvatarBase64, { public_id: `${res.data.username}/${timeStamp}-avatar-large` }, (error, result) => {
      if (error) {
        response.type = 'error'
        response.message = error
        return res.send(response)
      } else {
        console.log(result)
        const data = {
        avatar: `v${result.version}/${result.public_id}.${ result.format }`
        }
        userModel.update(id, data)
        response.type = 'success'
        response.message = 'Imágen actualizada con éxito'
      }
      return res.send(response)
      
    })

  } catch (error) {
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al actualizar la información'
    return res.send(response)
  }
}

module.exports = { signup, signin, isLogged, get, signout, update, updateAvatar, upload}