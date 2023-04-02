const router = require('express').Router()

// Controllers
const user = require('../controllers/user_controller')
const customer = require('../controllers/customer_controller')
const search = require('../controllers/search_controller')

router.get('/', user.isLogged, (req, res) => {
  if (res.isLogged) {
    res.render('index', { user: res.loggedUserData })
  } else {
    res.redirect('/signin')
  }
})
/**
 * Registro
 */

router.route('/signup')
  .get(user.isLogged, (req, res) => {
    if (res.isLogged) {
      res.redirect('/')
    } else {
      res.render('signup')
    }
  })
  .post(user.signup)
/**
 * Iniciar de sesión
 */
router.route('/signin')
  .get(user.isLogged, (req, res) => {
    if (res.isLogged) {
      res.redirect('/')
    } else {
      let user
      req.query.user ? user = req.query.user : user = ''
      res.render('signin', { user })
    }
  })
  .post(user.signin)

/**
 * Cerrar Sesión
 */
router.route('/signout/:username')
  .get(user.signout)

/**
 * Perfil de usuario
 */
router.route('/@:username')
  .get(user.isLogged, user.get, user.hasContact, (req, res) => {
    if (res.isLogged) {
      if (res.userProfile === false) {
        res.status(404).render('404')
      } else {
        if (res.userProfile.id === res.loggedUserId) {
          res.userProfile.active = true
        } else {
          res.userProfile.active = false
        }
        res.render('userProfile', { userProfile: res.userProfile, user: res.loggedUserData })
      }
    } else {
      res.redirect('/signin')
    }
  })
  .post(user.isLogged, user.get, (req, res, next) => {
    req.body.userId = res.loggedUserId
    req.body.contactsId = res.userProfile.id
    next()
  }, user.toogleContact)

router.route('/editar-perfil')
  .get(user.isLogged, (req, res) => {
    if (res.isLogged) {
      res.render('userProfileEdit', { user: res.loggedUserData })
      // }
    } else {
      res.redirect('/signin')
    }
  })

router.route('/userUpdate').post(user.isLogged, user.update)
router.route('/update-avatar')
  .post(user.isLogged, user.upload.single('userAvatar'), user.updateAvatar)

/**
 * Buscador
 */

router.route('/search').post(search.search)

router.route('/search?:q')
  .get(user.isLogged, search.search, (req, res) => {
    if (res.isLogged) {
      res.render('searchResults', { user: res.loggedUserData, searchResults: res.results })
    } else {
      res.redirect('/signin')
    }
  })
/**
 * Clientes
 */

router.route('/cliente/:id')
  .get(user.isLogged, customer.get, (req, res) => {
    if (res.isLogged) {
      if (res.customerData === false) {
        res.status(404).render('404')
      } else {
        res.render('customerProfile', { customer: res.customerData, user: res.loggedUserData })
      }
    } else {
      res.redirect('/signin')
    }
  })

router.route('/cliente').post(customer.update)

/**
 * Chat
 */

router.route('/chat')
  .get(user.isLogged, user.getContacts, (req, res) => {
  // si está logueado
  if (res.isLogged) {
    res.render('messenger', { user: res.loggedUserData, friend: null, contacts: res.userContacts })
  } else {
    res.redirect('/signin')
  }
})


router.route('/chat/@:username').get(user.isLogged, user.get, user.getContacts, (req, res) => {
  // si está logueado
  if (res.isLogged) {
    if (!res.userProfile) {
      res.status(404).render('404')
    } else {
      res.render('messenger', { user: res.loggedUserData, friend: res.userProfile, contacts: res.userContacts})
    }
  } else {
    res.redirect('/signin')
  }
})



router.route('*').get((req, res) => { res.status(404).render('404') })

module.exports = router