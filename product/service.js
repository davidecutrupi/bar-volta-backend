'use strict'

const errors = require('../errors')

class ProductService {
  constructor (productCollection) {
    this.productCollection = productCollection
  }

  // @method          POST
  // @url             /
  // @description     Aggiunge un prodotto
  async addProduct (product) {
    return await this.productCollection.insertOne(product)
  }

  // @method          GET
  // @url             /
  // @description     Ottiene tutti i prodotti
  async getAllProducts () {
    return await this.productCollection.find().toArray()
  }

  // @method          GET
  // @url             /:id
  // @description     Ottiene un prodotto
  async getProduct (productId) {
    if (!productId) { throw new Error(errors.NOT_FOUND) }
    return await this.productCollection.findOne({ _id: productId })
  }

  // @method          PUT
  // @url             /:id
  // @description     Modifica un prodotto
  async editProduct (productId, newProduct) {
    if (!productId) { throw new Error(errors.NOT_FOUND) }
    return await this.productCollection.replaceOne({ _id: productId }, newProduct)
  }

  // @method          DELETE
  // @url             /:id
  // @description     Elimina un prodotto
  async deleteProduct (productId) {
    if (!productId) { throw new Error(errors.NOT_FOUND) }
    return await this.productCollection.findOneAndDelete({ _id: productId })
  }

  //
  //
  // Utils
  async changeQta (productId, qta) {
    return await this.productCollection.findOneAndUpdate({ _id: productId }, { $inc: { qta: qta } })
  }

  async ensureIndex (db) {
    await db.command({
      collMod: this.productCollection.collectionName,
      validator: require('../mongo-schemas/products')
    })
  }
}

module.exports = ProductService
