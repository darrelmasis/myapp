const searchModel = require('../models/search_model')
let response = {}
const search = async (req, res) => {
  try {
    const search = {
      value: req.body.searchValue
    }
    if(search.value === '') {
      response.type = 'empty'
      response.message = 'Búsqueda vacía'
      return res.send(response)
    } else {
      const results = await searchModel.search(search.value)
      response.type = 'success'
      response.message = results
      return res.send(response)
    }

  } catch (error) {
    return error
  }
}

module.exports = {search}