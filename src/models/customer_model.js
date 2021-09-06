const baseModel = require('./base_model')

class Customer {

  get(value) {
   return baseModel.read('*','customers', `WHERE customerCode = '${value}'`)
  }

  getSeller(value) {
    return baseModel.read('*','sellers', `WHERE sellerCode = '${value}'`)
  }

  update(data) {
    return baseModel.update('customers', data.post, `WHERE customerCode = '${data.id}'`)
  }

}

module.exports = new Customer