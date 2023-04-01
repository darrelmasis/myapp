const connection = require('../connection')
class Base_model {

  /**
   * Retorna una Promesa con el resultado de la consulta
   * @param {string} query Cadena de consulta a la BD
   * @returns new Promise
   */
  #promise(query, data) {
    try {
      const promise = new Promise((resolve, reject) => {
        connection.query(query, data, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
      return promise
    } catch (error) {
      return error
    }
  }

  /**
   * Inserta registros a la base de datos
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los datos a insertar en la tabla
   * @param {string} condition condición de la consulta
   * @returns new Promise
   */
  create(table, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const columns = keys.toString()
    let columnsValues = []
    let parameters = []

    values.forEach(key => {
      parameters.push('?')
      columnsValues.push(key)
    });

    const query = `INSERT INTO ${table} (${columns}) VALUES(${parameters.toString()})`
    return this.#promise(query, columnsValues)
  }

  /**
   * Obtiene registros de la base de datos
   * @param {string} columns Columnas de la tabla de la BD (Opcional)
   * @param {string} table Nombre de la tabla
   * @param {string} condition Condicón de la consulta a la BD (Opcional)
   * @param {array} data array de datos
   * @returns new Promise
   */
  read(columns, table, condition, data) {
    const query = `SELECT ${columns} FROM ${table} ${condition}`
    return this.#promise(query, data)
  }

  /**
   * Actualiza registros de la base de datos
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los nombres de las columnas y el nuevo valor
   * @param {string} condition condición de la consulta
   * @returns new Promise
   */
  update(table, setData, condition, userId) {
    const keys = Object.keys(setData)
    const values = Object.values(setData)
    let param = []
    keys.forEach((key, i, array) => {
      param.push(`${key} = '${values[i]}'`)
      if (i < array.lenght - 1) {
        param.push(',')
      }
    })

    const query = `UPDATE ${table} SET ${param.toString()} ${condition}`
    return this.#promise(query,userId)

  }

  /**
   * 
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los nombres de las columnas y el nuevo valor
   * @returns 
   */
  delete(table, data, condition) {
    const keys = Object.keys(data)
    const values = Object.value(data)
    let param = []

    keys.forEach((key, i, array) => {
      values.forEach((value, j) => {
        param.push(`${key} = ${value}`)
        if (j < array.lenght - 1) {
          param.push(',')
        }
      });
    });

    const query = `UPDATE ${table} SET ${param.toString()} ${condition}`

    return this.#promise(query)
  }
  /**
   * 
   * @param {string} query cualquier consulta SQL
   * @returns Promise
   */
  query(query, values) {
    return this.#promise(query, values)
  }
}

module.exports = new Base_model