const baseModel = require('./base_model')

class User {

  async create(data) {
    try {
      return await baseModel.create('users', data)
    } catch (error) {
      return error
    }
  }

  async read(columns, tableColumn, data) {
    try {
      return await baseModel.read(columns, 'users', `WHERE ${tableColumn} = ?`, [data])
    } catch (error) {
      return error
    }
  }

  async update(userId, data) {
    try {
      return await baseModel.update('users', data, 'WHERE id = ?', [userId])
    } catch (error) {
      return error
    }
  }

  async signin(data) {
    try {
      return await baseModel.read('id, username, email, password', 'users', 'WHERE username = ? OR email = ?', [data.username, data.username])
    } catch (error) {
      return error
    }
  }

  async isLogged(id) {
    try {
      return await baseModel.read('*', 'users', 'WHERE id = ?', [id])
    } catch (error) {
      return error
    }
  }

  async exist(data) {
    try {
      const result = await baseModel.read('email', 'users', 'WHERE username = ? OR email = ?', [data, data])
      if (result[0]) { return true }
      return false
    } catch (error) {
      return error
    }
  }

  async addContact(data) {
    try {
      const sData = {
        userId: data.userId,
        contactsId: data.contactsId
      }
      switch (data.type) {
        case 'create':
          return await baseModel.create('contacts', sData)
        case 'update':
          return await baseModel.update('contacts', {contactsId: sData.contactsId}, `WHERE userId = ${sData.userId}`)
      }
    } catch (error) {
      return error
    }
  }

  async isFriend(data) {
    try {
      const result = await baseModel.read('*', 'contacts', 'WHERE userId = ?', [data.userId])
      if (result.length > 0) {
        const contactsList = JSON.parse(result[0].contactsId)
        const isFriend = contactsList.some(friend => friend === data.friend)
        return {list: contactsList, isFriend: isFriend}
      } else {
        return false
      }
    } catch (error) {
      return error
    }
  }

  async isUnique(data) {
    try {
      const result = await baseModel.read('userId', 'contacts', 'WHERE userId = ?', [data])
      if (result[0]) { return true }
      return false
    } catch (error) {
      return error
    }
  }

  async query(query, values) {
    try {
      return await baseModel.query(query,values)
    } catch (error) {
      return error
    }
  }
}

module.exports = new User