const connection = require('../connection')

/**
 * READ - Leer/Obtener datos
 */
const read = (request, response) => {
  connection.query(query, (error, result) => {
    if (error) {
      console.log('Ha ocurrido un error: ' + error)
    } else {
      response.json()
    }
  })
}

module.exports = read