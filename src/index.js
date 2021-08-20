const express = require('express')
const path = require('path')
const app = express()
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)
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
app.use('/login', require ('./routes/login'))

// Public
app.use(express.static(path.join(__dirname, 'public')))


// Server
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(app.get('port'), () => {
  console.log(`${app.get('title')} está corriendo en el puerto ${app.get('port')}`)
})




