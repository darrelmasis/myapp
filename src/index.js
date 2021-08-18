const express = require('express')
const path = require('path')
const app = express()
const userRoutes = require ('./routes/routes')
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
require('./socket.io')(io)

// Settings
app.set('title', 'myapp.js')
app.set('port', process.env.PORT || 3000)
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:false}))

// Routes
app.get('/', userRoutes)

// Server
server.listen(app.get('port'), () => {
  console.log(`${app.get('title')} está corriendo en el puerto ${app.get('port')}`)
})




