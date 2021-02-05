'use strict'

const DUPLICATE_KEY_ERROR_CODE = 11000
const errors = require('../errors')

class UserService {
  constructor (userCollection) {
    this.userCollection = userCollection
  }

  // @method          POST
  // @url             /
  // @description     Aggiunge un utente
  async addUser (user, hashFunction) {
    user.password = await hashFunction(user.password)
    try {
      return await this.userCollection.insertOne(user)
    } catch (e) {
      if (e.code === DUPLICATE_KEY_ERROR_CODE && e.keyPattern.username) {
        throw new Error(errors.USERNAME_IS_NOT_AVAILABLE)
      }
      throw e
    }
  }

  // @method          DELETE
  // @url             /
  // @description     Elimina un utente
  async deleteUser (userId) {
    if (!userId) { throw new Error(errors.NOT_FOUND) }
    return await this.userCollection.findOneAndDelete({ _id: userId })
  }

  // @method        POST
  // @url           /login
  // @description   Accedi ad un account
  async login (body, compareFunction) {
    let user, match
    try {
      user = await this.userCollection.findOne({ username: body.username })
      match = await compareFunction(body.password, user.password)
    } catch (e) {
      throw new Error(errors.INVALID_USERNAME)
    }
    if (match) { return user }
    throw new Error(errors.WRONG_PASSWORD)
  }

  // @method          GET
  // @url             /:id
  // @description     Ottiene un prodotto
  async getUser (userId) {
    if (!userId) { throw new Error(errors.NOT_FOUND) }
    return await this.userCollection.findOne({ _id: userId }, { projection: { username: 1, _id: 1 } })
  }

  //
  //
  // Utils
  async ensureIndex (db) {
    await db.command({
      collMod: this.userCollection.collectionName,
      validator: require('../mongo-schemas/users')
    })
  }
}

module.exports = UserService
