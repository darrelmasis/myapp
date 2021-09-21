const mysql = require('mysql')
const { mysql_database } = require('./config')

let host = mysql_database.local

const pool = mysql.createPool(host)

pool.getConnection((error, success) => {
  if (error) {
    throw error
  } else {
    console.log('%cConexión con la base de datos exitosa',"color: blue; font-size:15px;")
    return success
  }
})



module.exports = pool