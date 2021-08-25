const search_model = require('../models/search_model')

const search = (value) => {
  return search_model.search(value)
}

module.exports = search