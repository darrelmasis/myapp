const baseModel = require('./base_model')

/**
 * TODO
 * Retornar la cantidad total de coincidencias.
 * Hacer que los datos se retornen en un nuevo objeto {rowsFound, totalRowsFound}
 */
class Search {

  async search(value, scrollLimit) {
    try {
          let customers = await baseModel.read('customers.id, customers.customerCode AS href, customers.fullName, customers.avatar, "cliente/" AS type, sellers.sellerFullName AS description, CASE WHEN fullName LIKE ? THEN 1 WHEN fullName LIKE ? THEN 2 WHEN fullName LIKE ? THEN 3 ELSE 9999 END AS Sort', 'customers', 'LEFT JOIN sellers ON customers.seller = sellers.sellerCode WHERE MATCH(fullName) AGAINST(? IN NATURAL LANGUAGE MODE) OR MATCH(customerCode) AGAINST(? IN NATURAL LANGUAGE MODE) OR fullName LIKE ? OR customerCode LIKE ? ORDER BY Sort ASC LIMIT ?, ?', [`%${value}`, `${value}%`, `%${value}%`, `${value}`, `${value}`,`%${value}%`,`%${value}%`, scrollLimit.start, scrollLimit.end])

          let users = await baseModel.read('id, username AS href, fullName, "@" AS type, avatar, bio AS description, CASE WHEN fullName LIKE ? THEN 1 WHEN fullName LIKE ? THEN 2 WHEN fullName LIKE ? THEN 3 ELSE 9999 END AS Sort', 'users', 'WHERE MATCH(fullName) AGAINST(? IN NATURAL LANGUAGE MODE) OR MATCH(username) AGAINST(? IN NATURAL LANGUAGE MODE) OR fullName LIKE ? ORDER BY Sort ASC LIMIT ?, ?', [`%${value}`, `${value}%`, `%${value}%`, `${value}`, `${value}`, `%${value}%`, scrollLimit.start, scrollLimit.end])

          users[0] != undefined ? customers.push(users[0]) : false

          return customers.sort((a, b) => a.Sort - b.Sort) 

    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = new Search
