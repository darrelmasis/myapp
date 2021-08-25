const connection = require("./connection")
const searchController = require('./controllers/search_controller')
const now = (unit) => {
  
  const hrTime = process.hrtime();
  
  switch (unit) {
    
    case 'milli':
      return hrTime[0] * 1000 + hrTime[1] / 1000000;
      
    case 'micro':
      return hrTime[0] * 1000000 + hrTime[1] / 1000;
      
    case 'nano':
    default:
      return hrTime[0] * 1000000000 + hrTime[1];
  }
  
};

module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on('search', (search) => {
        if(search.value != '') {
          let start = now('milli')
         searchController(search.value)
         .then(data => {
            socket.emit('search-results', { result: data})
         })

        let end = now('milli')
        socket.emit('search-time', {milli: Math.floor(end - start)/1000})
        }

    })

    socket.on('disconnect', () => {
      console.log('Usuario desconectado')
    })

  })
}
