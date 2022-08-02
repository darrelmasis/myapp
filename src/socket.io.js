module.exports = io => {
  let chats = []
  let users = []
  io.on('connection', socket => {

    // socket.on('newChat', data => {
    //   chats.push(data)
    //   socket.broadcast.to(data.room).emit('newChat', chats)
    // })

    // socket.on('typing', data => {
    //   console.log(data.to)
    //   socket.to('mkailuma').emit('typing', { msg: `${data.user} está escribiendo...`, status: data.status })
    // })

    
    socket.on('disconnect', () => {
      const currentUser = users.findIndex(element => element.socketId === socket.id)
      if (currentUser !== -1) {
      }
      // users = users.splice(0,currentUser)
      // socket.emit('usersOnline', users)
    })

    // Escuchamos evento cuando se conecte un nuevo usuario
    socket.on('userConnected', user => {
      const hasClientId = users.some(data => data.id === user.id)

      user.socketId = socket.id
      const currentUser = users.findIndex(data => data.id === user.id)
      // si no está en el array, se agrega
      !hasClientId ? users.push(user) : users[currentUser] = user
      // luego emite un evento al cliente con los datos de los usuarios conectados
      io.emit('usersOnline', users)
    })

    socket.on('disconnect', function () {

      socket.emit('clientDisconnected', socket.id)

    })

    // socket.on('setUserOnline', data => {
    //   socket.broadcast.emit('changeUserStatus')
    // })

  })
}