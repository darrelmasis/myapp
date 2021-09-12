const baseModel = require('./base_model')

class User {

  async create(data) {
    try {
      return await baseModel.create('users', data)
    } catch (error) {
      return error
    }
  }

  async read(data) {
    try {
      return await baseModel.read('*', 'users', `WHERE username = '${data}'`)
    } catch (error) {
      return error
    }
  }

  async signin(data) {
    try {
      return await baseModel.read('*', 'users', 'WHERE username = ? OR email = ?', [data.username, data.username])
    } catch (error) {
      return error
    }
  }

  async isLogged(id) {
    try {
      return await baseModel.read('*', 'users', `WHERE id = '${id}'`)
    } catch (error) {
      return error
    }
  }

  async exist(data) {
    try {
      const result = await baseModel.read('email', 'users', 'WHERE username = ? OR email = ?', [data, data])
      if (result) { return true }
      return false
    } catch (error) {
      return error
    }
  }
}

module.exports = new User