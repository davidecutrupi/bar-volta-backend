'use strict'

const errors = require('../errors')

class OrderService {
  constructor (orderCollection) {
    this.orderCollection = orderCollection
  }

  // @method          POST
  // @url             /
  // @description     Aggiunge un ordine
  async addOrder (order) {
    return await this.orderCollection.insertOne(order)
  }

  // @method          GET
  // @url             /
  // @description     Ottiene tutti gli ordini
  async getAllOrders () {
    return await this.orderCollection.find().toArray()
  }

  // @method          GET
  // @url             /:id
  // @description     Ottiene un ordine
  async getOrder (orderId) {
    if (!orderId) { throw new Error(errors.NOT_FOUND) }
    return await this.orderCollection.findOne({ _id: orderId })
  }

  // @method          PUT
  // @url             /:id
  // @description     Modifica un prodotto
  async confirmOrder (orderId) {
    if (!orderId) { throw new Error(errors.NOT_FOUND) }
    return await this.orderCollection.updateOne({ _id: orderId }, { $set: { confirmed: true } })
  }

  // @method          DELETE
  // @url             /:id
  // @description     Elimina un prodotto
  async deleteOrder (orderId) {
    if (!orderId) { throw new Error(errors.NOT_FOUND) }
    return await this.orderCollection.findOneAndDelete({ _id: orderId })
  }

  //
  //
  // Utils
  async getUserOrders (userId) {
    return await this.orderCollection.find({ from: userId }).toArray()
  }

  async ensureIndex (db) {
    await db.command({
      collMod: this.orderCollection.collectionName,
      validator: require('../mongo-schemas/orders')
    })
  }
}

module.exports = OrderService
