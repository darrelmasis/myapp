const express = require('express')
const path = require('path')
const app = express()
const user = require ('./routes/routes')
// const http = require('http')
// const connection = require('./connection')
// const socketio = require('socket.io')

// Settings
app.set('title', 'myapp.js')
app.set('port', 3000)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))

// Routes
app.get('/', user)


// Server
app.listen(app.get('port'), () => {
  console.log(`${app.get('title')} está corriendo en el puerto ${app.get('port')}`)
})




