const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const searchRoute = require('./routes/search_route')
const customerRoute = require('./routes/customer_route')
const path = require('path')
const socketio = require('socket.io')
const io = socketio(server)
const port = process.env.PORT || 3000
require('./socket.io')(io)

// Configuración básica
app.set('title', 'myapp')
app.set('port', process.env.PORT || 3000)

// Motor de vistas [pug]
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views/pages/'))

// Archivos estáticos
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// Routes
app.get('/', searchRoute)
app.get('/cliente/:id', customerRoute)
app.get('/cliente/', (req, res) => {
  res.redirect('/')
})
app.post('/save', customerRoute)

server.listen(port, () => {
  console.log(`Aplicación ${app.get('title')} corriendo en el puerto ${port}`)
})




