const searchModel = require('../models/search_model')
let response = {}
const search = async (req, res, next) => {
  
  try {
    const search = {
      value: req.body.searchValue || req.params.q,
      scrollLimit: req.body.scrollLimit
    }
    // si el valor de la búsqueda está vacío
    if(search.value === '') {
      response.type = 'empty'
      response.message = 'Búsqueda vacía'
      if (req.route.path === '/search/:q') {
        return next()
      }
      return res.send(response)
    } else {
      
      const results = await searchModel.search(search.value, search.scrollLimit)
      response.type = 'success'
      response.message = `Se han encontrado ${results.length} coincidencias`
      response.data = results
      response.length = response.data.length
      res.results = response
      if (req.route.path === '/search/:q') {
        return next()
      }

      return res.send(response)
    }


  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {search}