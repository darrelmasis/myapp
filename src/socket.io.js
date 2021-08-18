const express = require('express')
const path = require('path')
const app = express()
const userRoutes = require ('./routes/routes')

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Usuario conectado')

    socket.on('search', (data) => {
      console.log('criterio de búsqueda: ' + data.searchCriteria)
      app.use(userRoutes)
    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })

  })
}
