const baseModel = require('./base_model')

class User {

    async create(data) {
        return await baseModel.create('users', data)
    }

    async read(data) {
        return await baseModel.read('*', 'users', `WHERE id = ${data}`)
    }

    async signin(data) {
        return await baseModel.read('*', 'users', `WHERE username = '${data.username}' OR email = '${data.username}'`)
    }
}

module.exports = new User