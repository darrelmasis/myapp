const baseModel = require('./base_model')

class User {

    async create(data) {
        return await baseModel.create('users', data)
    }

    async read(data) {
        return await baseModel.read('*', 'users', `WHERE username = '${data}'`)
    }

    async signin(data) {
        return await baseModel.read('*', 'users', `WHERE username = '${data.username}' OR email = '${data.username}'`)
    }

    async isLogged(id) {
        return await baseModel.read('*', 'users', `WHERE id = '${id}'`)
    }
}

module.exports = new User