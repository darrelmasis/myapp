const customer_model = require('../models/customer_model')

const get = async (req, res, next) => {
  try {
    await customer_model.get(req.params.id).then( async data => {
      req.customer = data[0]
      await customer_model.getSeller(data[0].seller).then(dataSeller => {
        data[0].sellerInfo = dataSeller[0]
        data[0].dateFormat = d => {
          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
          const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
          let date = new Date(d)
          let day = date.getDate()
          day < 10 ? day = '0' + day : null
          let month = date.getUTCMonth()
          month < 10 ? month = '0' + month : null
          let year = date.getFullYear()

          return {
            day: day,
            month: month,
            year: year,
            short: day + '/' + month + '/' + year,
            large: days[date.getDay()] + ' ' + day + ' de ' + months[date.getMonth()] + ' de  ' + year
          }
        }
      })
      return next()
    })
  } catch (error) {
    console.log(error)
  }
}

const getSeller = (value) => {
  return customer_model.getSeller(value)
}

const update = (data) => {
  return customer_model.update(data)
}

module.exports = { get, getSeller, update }