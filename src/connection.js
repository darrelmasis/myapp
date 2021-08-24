const mysql = require('mysql')
const { mysql_database } = require('./config')

let host = mysql_database.remote

const connection = mysql.createConnection(host)

connection.connect((error, success) => {
  if (error) {
    console.log('Hubo algunos errores durante la conexión: ' + error)
  } else {
    console.log(`Conexión con la base de datos "${host.database}" exitosa`)
    return success
  }
})

connection.on('error', err => {
  console.log(err.toString())
})

setInterval(function () {
  connection.query('SELECT 1');
}, 2000);


module.exports = connection