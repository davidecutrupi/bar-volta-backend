'use strict'

const {
  addProduct: addProductSchema,
  getAllProducts: getAllProductsSchema,
  getProduct: getProductSchema,
  editProduct: editProductSchema,
  deleteProduct: deleteProductSchema
} = require('./schemas')

const errors = require('../errors')

module.exports = async function (fastify) {
  //
  // Error handler
  await fastify.setErrorHandler(async function (error, req, reply) {
    if (error.message === errors.NOT_FOUND) {
      reply.status(400).send(error)
    } else {
      reply.status(500).send(error)
    }
  })

  //
  // Api da loggato
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)

    fastify.get('/', { schema: getAllProductsSchema }, getAllProductsHandler)
    fastify.get('/:id', { schema: getProductSchema }, getProductHandler)
  })

  //
  // Solo admin e sellers
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)
    fastify.addHook('preHandler', fastify.onlySellers)

    fastify.post('/', { schema: addProductSchema }, addProductHandler)
    fastify.put('/:id', { schema: editProductSchema }, editProductHandler)
    fastify.delete('/:id', { schema: deleteProductSchema }, deleteProductHandler)
  })
}

//
// Decorators
module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: [
      'authPreHandler',
      'onlySellers',
      'productService',
      'transformStringIntoObjectId'
    ]
  }
}

//
// Handlers
async function addProductHandler (req, reply) {
  const { body } = req
  return (await this.productService.addProduct(body)).ops[0]
}

async function getAllProductsHandler (req, reply) {
  return await this.productService.getAllProducts()
}

async function getProductHandler (req, reply) {
  const { id } = req.params
  const product = await this.productService.getProduct(this.transformStringIntoObjectId(id))
  if (product) {
    return product
  } else {
    throw new Error(errors.NOT_FOUND)
  }
}

async function editProductHandler (req, reply) {
  const { id } = req.params
  const { body } = req
  return (await this.productService.editProduct(this.transformStringIntoObjectId(id), body)).ops[0]
}

async function deleteProductHandler (req, reply) {
  const { id } = req.params
  const results = await this.productService.deleteProduct(this.transformStringIntoObjectId(id))
  if (results.ok) {
    reply.status(200).send()
  } else {
    throw new Error()
  }
}
