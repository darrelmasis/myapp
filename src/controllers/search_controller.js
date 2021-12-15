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
      const valueLength = search.value.length
      let type = 'match'
      const preResults = await searchModel.search(search.value, type)
      if(preResults.length === 0 && type === 'match') {
        type = 'like'
      } else if(preResults.length === 0 && type === 'like') {
        type = 'match'
      }

      const results = await searchModel.search(search.value, type)
      response.type = 'success'
      response.message = results
      return res.send(response)
    }

  } catch (error) {
    return error
  }
}

module.exports = {search}