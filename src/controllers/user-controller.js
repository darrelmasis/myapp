const connection = require('../connection')
const read = (request, response) => {
  const query = 'SELECT * FROM customers WHERE MATCH(fullName,bussinessName) AGAINST("rosa margarita") LIMIT 5'
  connection.query(query, (error, result) => {
    if (error) {
      console.log('Ha ocurrido un error en la consulta: ' + error)
    } else {
      response.render('index', {users: result})
    }
  })
}

module.exports = {read}
