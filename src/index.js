const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const router = require('./routes/router')
const path = require('path')
const socketio = require('socket.io')
const io = socketio(server)
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')

require('./socket.io')(io)

// Configuración básica
app.set('title', 'myapp')
app.set('port', port)

// Motor de vistas [pug]
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views/pages/'))

// Archivos estáticos
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//para poder trabajar con las cookies
app.use(cookieParser())

// Routes
app.use('/', router)

server.listen(port, () => {
  console.log(`Aplicación ${app.get('title')} corriendo en el puerto ${port}`)
})