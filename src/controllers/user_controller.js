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

const empty = element => {
  return element === '' ? true : false
}

const signup = async (req, res) => {
  try {
    const user = {
      fullName: req.body.fullName,
      username: req.body.username.toLowerCase(),
      email: req.body.email.toLowerCase(),
      password: req.body.password, //
      gender: req.body.gender,
      avatar: 'avatar.png',
      createTime: new Date()
    }

    console.log(user)

    const exist = await userModel.exist(user.email)
    if (exist) {
      response.type = 'error'
      response.element = '#emailMessage'
      response.message = `El correo <span class="fw-bold">${user.email}</span> ya está asociado a una cuenta`
      return res.send(response)
    } else {

      if (empty(req.body.firstName) && empty(req.body.lastName) && empty(req.body.email) && empty(req.body.gender) && empty(req.body.password.pass1) || empty(req.body.password.pass1)) {
        response.type = 'error'
        response.element = '#messages'
        response.message = 'Todos los campos son requeridos'
        return res.send(response)
      } else if (req.body.password.pass1 !== req.body.password.pass2) {
        response.type = 'error'
        response.element = '#passwordMessage'
        response.message = 'Las contraseñas no coinciden'
        return res.send(response)
      }

      if (response.type !== 'error') {
        user.password = await bcryptjs.hash(req.body.password.pass1, 8)
        let defaultAvatar = ''
        if (user.gender === 'Masculino') {
          defaultAvatar = 'male-avatar.png'
        } else {
          defaultAvatar = 'female-avatar.png'
        }

        await cloudinary.uploader.upload(`src/public/dist/assets/${defaultAvatar}`, { public_id: `${user.username}/avatar` }, (error, result) => {
          user.avatar = `v${result.version}/${result.public_id}.${result.format}`
          userModel.create(user)
          response.type = 'success'
          response.element = '#messages'
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
    const { username, password } = req.body
    /**
     * TODO:
     * // Comprobar si los campos estan vacíos
     * // si el usuario existe en los registros de la BD
     * // Comparar la contraseña introducida con la encriptada en la BD
     * // Crear la cookie y el token de login
     * * Recuperar la contraseña
     */

    if (username === '' || password === '') {
      response.type = 'empty'
      response.message = 'Todos los campos son requeridos'
      return res.send(response)
    } else {
      const userExist = await userModel.exist(username)
      if (!userExist) {
        response.type = 'warning'
        response.message = `El usuario <span class="fw-semibold">${username}</span> no está asociado a ninguna cuenta`
        console.log(response)
        return res.send(response)
      } else {
        let results = await userModel.signin({ username, password })
        results = results[0]

        if (!(await bcryptjs.compare(password, results.password))) {
          response.type = 'warning'
          response.message = 'Usuario o contraseña incorrecta'
          return res.send(response)
        } else {
          const token = jwt.sign({ id: results.id }, 'super_secret', { expiresIn: '365d' })
          const cookiesOptions = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
          }
          res.cookie('jwt', token, cookiesOptions)
          response.type = 'succes'
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
    const userId = res.data.id
    userModel.update(userId, userData)
    response.type = 'success'
    response.message = 'Información actualizada correctamente'
    return res.send(response)
  } catch (error) {
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al actualizar la información'
    return res.send(response)
  }
}

const updateAvatar = async (req, res) => {
  try {
    const id = res.data.id
    const timeStamp = Date.now()
    await cloudinary.uploader.upload(req.body.userAvatarBase64, { public_id: `${res.data.username}/${timeStamp}-avatar-large` }, (error, result) => {
      if (error) {
        response.type = 'error'
        response.message = error
        return res.send(response)
      } else {
        const data = {
          avatar: `v${result.version}/${result.public_id}.${result.format}`
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

const addContact = async (req, res) => {
  try {
    const data = {
      userId: req.body.userId,
      contactsId: JSON.stringify([req.body.contactsId]),
      friend: req.body.contactsId,
      type: 'create'
    }

    const contact = await userModel.isFriend(data)
    const isUnique = await userModel.isUnique(req.body.userId)
    if (isUnique) { // cuando el usuario está registrado y tiene al menos 1 contacto
      if (!contact.isFriend) { // si el contacto quese está agregando no está en la lista del usuario
        // añade el nuevo contacto
        contact.list.push(req.body.contactsId)
        const sendData = {
          userId: req.body.userId,
          contactsId: JSON.stringify(contact.list),
          type: 'update'
        }
        userModel.addContact(sendData)
        response.type = 'success'
        response.message = 'Contacto agreado con éxito'
        return res.send(response)

      } else { // si el contacto ya está en la lista
        response.type = 'error'
        response.message = 'Ya existe en tu lista de contactos'
        return res.send(response)
      }
    } else { // cuando el usuario no está registrado y no tiene ningun contacto
      userModel.addContact(data)
      response.type = 'success'
      response.message = 'Usuario y contacto agregado con éxito'
      return res.send(response)
    }

  } catch (error) {
    response.type = 'error'
    response.message = 'No se pudo añadir el contacto'
    console.log(error)
    res.send(response)
  }
}

const removeContact = async (req, res,) => {
  try {
    const data = {
      userId: req.body.userId,
      friend: req.body.contactsId,
      type: 'update'
    }

    const contact = await userModel.isFriend(data)
    const toRemove = contact.list.findIndex(element => element === req.body.contactsId)
    contact.list.splice(toRemove, 1)
    data.contactsId = JSON.stringify(contact.list)
    if (contact.isFriend) {
      userModel.addContact(data)
      response.type = 'success'
      response.message = 'Contacto eliminado ocn éxito'
      return res.send(response)
    }

  } catch (error) {
    response.type = 'error'
    response.message = 'No se pudo eliminar el contacto'
    console.log(response)
    return res.send(response)
  }

}

const hasContact = async (req, res, next) => {
  // Traer toda la lista de contactos del usuario activo
  // y verificar si el perfil del usuario en pantalla está en la lista
  const q = await userModel.query('SELECT contacts.contactsId FROM contacts INNER JOIN users ON contacts.userID = ? && users.id = ?', [res.data.id, res.data.id])
  if (q.length > 0) {
    const contactsList = JSON.parse(q[0].contactsId)
    const isFriend = contactsList.some(friend => friend === res.userProfile.id)
    res.userProfile.isFriend = isFriend
  } else {
    res.userProfile.isFriend = false
  }
  next()
}

const getContacts = async (req, res, next) => {
  const q = await userModel.query('SELECT contacts.contactsId FROM contacts INNER JOIN users ON contacts.userID = ? && users.id = ?', [res.data.id, res.data.id])
  if (q.length > 0) {
    const userContacts = JSON.parse(q[0].contactsId)
    let newArr = []
    for (let i = 0; i < userContacts.length; i++) {
      const element = await userModel.query('SELECT id,fullName,username,email,gender,avatar,bio FROM users WHERE id = ?', [userContacts[i]]);
      newArr.push(element[0])
    }
    res.userContacts = newArr
  } else {
    res.userContacts = null
  }

  next()
}

const memoryStorage = multer.memoryStorage()
const upload = multer({ memoryStorage })

module.exports = { signup, signin, isLogged, get, signout, update, updateAvatar, upload, addContact, hasContact, removeContact, getContacts }