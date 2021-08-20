const connection = require('../connection')
const userModel = require('../models/base_model')


exports.read = (req, res, next) => {
  const query = 'SELECT * FROM customers WHERE MATCH(fullName,bussinessName) AGAINST("rosa margarita") LIMIT 5'
  connection.query(query, (error, result) => {
    if (error) {
      console.log('Ha ocurrido un error en la consulta: ' + error)
    } else {
      const x = new userModel('Darrel Masis')
      x.hello('Darrel I. Masis')
      res.render('index', { users: result })
    }
  })
}
