const customer_model = require('../models/customer_model')

const get = (value) => {
  return customer_model.get(value)
}

const getSeller = (value) => {
  return customer_model.getSeller(value)
}

const update = (data) => {
  return customer_model.update(data)
}

module.exports = {get, getSeller, update}