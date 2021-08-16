const mysql = require('mysql')
const { mysql_database } = require('./config')

const connection = mysql.createConnection(mysql_database)

connection.connect((error, success) => {
  if (error) {
    console.log('Hubo algunos errores durante la conneción: ' + error)
  } else {
    console.log('Conexión con la BD exitosa')
    return success
  }
})

module.exports = connection