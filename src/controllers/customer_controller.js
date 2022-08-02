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
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
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