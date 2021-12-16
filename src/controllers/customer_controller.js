const customer_model = require('../models/customer_model')
let response = {}

const get = async (req, res, next) => {
  try {
    await customer_model.get(req.params.id)
      .then(data => {
        if (data.length === 0) {
          res.customerData = false
          return next()

        } else {
          res.customerData = data[0]
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
          return next()
        }
      })
  } catch (error) {
    console.log(error)
  }
}

const getSeller = (value) => {
  return customer_model.getSeller(value)
}

// Actualiza la información de los clientes
const update = async (req, res) => {
  try {
    const customerData = {
      customerCode: req.body.customerCode,
      address: req.body.address,
      primaryPhone: req.body.primaryPhone,
      primaryEmail: req.body.primaryEmail,
      coords: req.body.coords
    }

    customer_model.update(customerData)
    response.type = 'success'
    response.message = 'Información actualizada correctamente'
    return res.send(response)
  } catch (error) {
    response.type = 'error'
    response.message = '¡Oops! Hubo algunos errores al actualizar la información'
    return res.send(response)
  }
}

module.exports = { get, getSeller, update }