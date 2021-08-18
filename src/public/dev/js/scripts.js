const socket = io()

const searchBar = document.getElementById('search')
const output = document.getElementById('customersList')

searchBar.addEventListener('keyup', (e) => {
  socket.emit('search', {searchCriteria: searchBar.value})
})



