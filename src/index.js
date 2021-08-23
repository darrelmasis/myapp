const express = require('express')
const path = require('path')
const app = express()
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.POT || 3000
require('./socket.io')(io)

// Settings
app.set('title', 'myapp')
app.set('port', process.env.PORT || 3000)
// view engine setup
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middlewares
app.use(express.urlencoded({extended:false}))

// Routes
app.use('/', require ('./routes/index'))

// Public
app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => {
  console.log(`${app.get('title')} está corriendo en el puerto ${port}`)
})




