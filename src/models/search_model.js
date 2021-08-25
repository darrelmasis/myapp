const baseModel = require('./base_model')

class Search {

  search(value) {
   return baseModel.read('*','customers', `WHERE fullName LIKE '%${value}%'`)
  }
}

module.exports = new Search
