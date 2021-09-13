const baseModel = require('./base_model')

class Search {

  async search(value) {
    try {
      return await baseModel.read('*','customers', 'WHERE fullName LIKE ? OR customerCode LIKE ?', [`%${value}%`,`%${value}%`])
    } catch (error) {
      return error
    }
  }
}

module.exports = new Search
