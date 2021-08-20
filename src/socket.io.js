const express = require('express')
const path = require('path')
const app = express()
const userRoutes = require ('./routes/routes')

module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on('search', (data) => {
      console.log('criterio de búsqueda: ' + data.searchCriteria)
      io.emit('hello', 'hola mundo')
    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })

  })
}
