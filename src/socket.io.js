module.exports = io => {
  let chats = []
  io.on('connection', socket => {
    io.emit('chat', chats)

    socket.on('chat', data => {
      chats.push(data)
      io.emit('chat', chats)
    })

    socket.on('typing', data => {
      socket.broadcast.emit('typing', {msg: `${data.name} está escribiendo...`})
    })
  })
}