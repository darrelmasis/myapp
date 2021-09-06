const connection = require('../connection')
class Base_model {

  /**
   * Retorna una Promesa con el resultado de la consulta
   * @param {string} query Cadena de consulta a la BD
   * @returns new Promise
   */
  #promise(query) {
    const promise = new Promise((resolve, reject) => {
      connection.query(query, (err, result) => {
        if (err) {
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
   * @param {string} condition condición de la consulta
   * @returns new Promise
   */
  create(table, data) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    let param = []

    keys.forEach((key, i, array) => {
      param.push(`${key} = '${values[i]}'`)
      if (i < array.lenght - 1) {
        param.push(',')
      }
    });

    const query = `INSERT INTO ${table} SET ${param}`
    return this.#promise(query)
  }

  /**
   * Obtiene registros de la base de datos
   * @param {string} [columns] Columnas de la tabla de la BD (Opcional)
   * @param {string} table Nombre de la tabla
   * @param {string} [condition] Condicón de la consulta a la BD (Opcional)
   * @param {string} condition condición de la consulta
   * @returns new Promise
   */
  read(columns = '*', table, condition = '') {
    const query = `SELECT ${columns} FROM ${table} ${condition}`


    // return new Promise ((resolve, reject) => {
    //   connection.query(query, (err, result) => {
    //     if(err) {
    //       console.log('Ha habido un error en la consulta: ' +err)
    //       reject(err)
    //     } else {
    //       resolve(result)
    //     }
    //   })
    // })
    return this.#promise(query)

  }

  /**
   * Actualiza registros de la base de datos
   * @param {string} table Nombre de la tabla
   * @param {object} data Objeto con los nombres de las columnas y el nuevo valor
   * @param {string} condition condición de la consulta
   * @returns new Promise
   */
  update(table, data, condition) {
    const keys = Object.keys(data)
    const values = Object.values(data)
    let param = []

    keys.forEach((key, i, array) => {
      param.push(`${key} = '${values[i]}'`)
      if (i < array.lenght - 1) {
        param.push(',')
      }
    });

    const query = `UPDATE ${table} SET ${param.toString()} ${condition}`
    console.log(query)
    connection.query(query, (err, result) => {
      if (err) {
        return console.log(err)
      } else {
        return console.log(result)
      }
    })

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
}

module.exports = new Base_model