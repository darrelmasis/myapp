const connection = require('../connection')
class Base_model {

  /**
   * Retorna una Promesa con el resultado de la consulta
   * @param {string} query Cadena de consulta a la BD
   * @returns new Promise
   */
  #promise (query) {
    const promise = new Promise ((resolve,reject) => {
      connection.query(query, (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })

    return promise
  }

  /**
   * Inserta registros a la base de datos
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los datos a insertar en la tabla
   * @returns new Promise
   */
  create(table, data, condition) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    let params = []

    for (let i = 0; i < keys.length; i++) {
      i < keys.length - 1 ? params.push('?,') : params.push('?')
    }
    const query = `INSERT INTO ${table} (${Object.keys(data).join()}) VALUES (${params}), ${values}`

    return this.#promise(query)
  }

  /**
   * Obtiene registros de la base de datos
   * @param {string} columns Columnas de la tabla de la BD
   * @param {string} table Nombre de la tabla
   * @param {string} [condition] Condicón de la consulta a la BD (Opcional)
   * @returns new Promise
   */
  read(columns = '*', table, condition = '') {
    const query = `SELECT ${columns} FROM ${table} ${condition}`

    return this.#promise(query)
  }

  /**
   * Actualiza registros de la base de datos
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los nombres de las columnas y el nuevo valor
   * @param {string} condition condición
   * @returns new Promise
   */
  update(table, data, condition) {
    const keys = Object.keys(data)
    const values = Object.value(data)
    let arguments = []

    keys.forEach((key, i, array) => {
      values.forEach((value, j) => {
        arguments.push(`${key} = ${value}`)
        if (j < array.lenght - 1) {
          arguments.push(',')
        }
      });
    });

    const query = `UPDATE ${table} SET ${arguments.toString()}`

    return this.#promise(query)
  }

  /**
   * 
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los nombres de las columnas y el nuevo valor
   * @returns 
   */
  delete(table, data) {
    const keys = Object.keys(data)
    const values = Object.value(data)
    let arguments = []

    keys.forEach((key, i, array) => {
      values.forEach((value, j) => {
        arguments.push(`${key} = ${value}`)
        if (j < array.lenght - 1) {
          arguments.push(',')
        }
      });
    });

    const query = `UPDATE ${table} SET ${arguments.toString()}`

    return this.#promise(query)
  }
}

module.exports = new Base_model