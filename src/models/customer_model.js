const baseModel = require('./base_model')

class Customer {

  async get(value) {
   return baseModel.read('*','customers', `LEFT JOIN sellers ON seller = sellers.sellerCode WHERE customerCode = '${value}'`)
  }

  async update(data) {
    try {
      return await baseModel.update('customers', data, `WHERE customerCode = '${data.customerCode}'`)
    } catch (error) {
      return error
    }
  }

}

module.exports = new Customer