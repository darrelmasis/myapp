const connection = require("../connection")
class Customer {
  constructor() {
    this.result = {}
  }
  /**
   * 
   * @param {string} table table name
   * @param {*} condition [WHERE] + column = something
   */
  read(table, value) {
    let mode = 'like'
    const searchValue = value.split('').lenght
    const fulltext = `SELECT * FROM ${table} WHERE MATCH(fullName) AGAINST('${value}')`
    const like = `SELECT * FROM ${table} WHERE fullName LIKE '%${value}%'`
    let query = like

    connection.query(query, (err, result) => {
      if (err) {
        console.log(`Ha ocurrido un error en la consulta: ${err}`)
      } else {
        return result
      }
    })
  }
}

module.exports = Customer