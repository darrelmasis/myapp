const baseModel = require('./base_model')

class Search extends baseModel {

  search(value) {
    baseModel.read('','customers', `WHERE fullName LIKE '%${value}%'`)
  }
}