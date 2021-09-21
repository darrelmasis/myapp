const baseModel = require('./base_model')

class Customer {

  get(value) {
   return baseModel.read('*','customers', `LEFT JOIN sellers ON seller = sellers.sellerCode WHERE customerCode = '${value}'`)
  }

  update(data) {
    return baseModel.update('customers', data.post, `WHERE customerCode = '${data.id}'`)
  }

}

module.exports = new Customer