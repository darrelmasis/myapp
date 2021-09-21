const baseModel = require('./base_model')

class Search {

  async search(value, mode) {
    try {
      switch (mode) {
        case 'match':
          return await baseModel.read('*', 'customers', 'WHERE MATCH(fullName) AGAINST(? IN NATURAL LANGUAGE MODE)', [`${value}`])
          break;
        case 'like':
          return await baseModel.read('*', 'customers', 'WHERE fullName LIKE ? OR customerCode LIKE ?', [`%${value}%`, `%${value}%`])
          break;
        default:
          return await baseModel.read('*', 'customers', 'WHERE fullName LIKE ? OR customerCode LIKE ?', [`%${value}%`, `%${value}%`])
          break;
      }
    } catch (error) {
      return error
    }
  }
}

module.exports = new Search
