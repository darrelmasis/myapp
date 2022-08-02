/**
 * TODO:
 * Realiza la conexión a la base de datos
 * @author [DM] <darrelmasis@gmail.com>
 * @version 1.0
 * @return {connection}
 */
const mysql = require('mysql')
const { mysql_database } = require('./config')

let host = mysql_database.remote

const pool = mysql.createPool(host)

pool.getConnection((error, success) => {
  if (error) {
    throw error
  } else {
    console.log('Conexión con la base de datos exitosa')
    return success
  }
})

module.exports = pool