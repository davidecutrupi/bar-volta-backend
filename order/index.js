'use strict'

const {
  addOrder: addOrderSchema,
  getAllOrders: getAllOrdersSchema,
  getOrder: getOrderSchema,
  refuseOrder: refuseOrderSchema,
  deleteOrder: deleteOrderSchema
} = require('./schemas')

const errors = require('../errors')

module.exports = async function (fastify) {
  //
  // Error handler
  await fastify.setErrorHandler(async function (error, req, reply) {
    if (error.message === errors.NOT_FOUND) {
      reply.status(400).send(error)
    } else if (error.message === errors.PRODUCT_UNAVALIABLE) {
      reply.status(400).send(error)
    } else {
      reply.status(500).send(error)
    }
  })

  //
  // Api da loggato
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)
    fastify.post('/', { schema: addOrderSchema }, addOrderHandler)
  })

  //
  // Solo venditori e admin
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)
    fastify.addHook('preHandler', fastify.onlySellers)

    fastify.get('/', { schema: getAllOrdersSchema }, getAllOrdersHandler)
    fastify.get('/:id', { schema: getOrderSchema }, getOrderHandler)
    fastify.put('/:id', { schema: refuseOrderSchema }, refuseOrderHandler)
    fastify.delete('/:id', { schema: deleteOrderSchema }, deleteOrderHandler)
  })
}

//
// Decorators
module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: [
      'authPreHandler',
      'onlySellers',
      'orderService',
      'productService',
      'userService',
      'transformStringIntoObjectId'
    ]
  }
}

//
// Handlers
async function addOrderHandler (req, reply) {
  const { body } = req
  const { _id } = req.payload

  body.from = this.transformStringIntoObjectId(_id)
  body.createdAt = new Date()
  body.confirmed = false

  for await (const productObj of body.products) {
    productObj.product = this.transformStringIntoObjectId(productObj.product)
    const product = await this.productService.getProduct(productObj.product)
    if (product.qta < productObj.qta) {
      throw new Error(errors.PRODUCT_UNAVALIABLE)
    }
  }

  for await (const productObj of body.products) {
    await this.productService.changeQta(productObj.product, productObj.qta * -1)
  }

  return (await this.orderService.addOrder(body)).ops[0]
}

async function getAllOrdersHandler (req, reply) {
  const orders = await this.orderService.getAllOrders()

  for await (const order of orders) {
    order.from = (await this.userService.getUser(this.transformStringIntoObjectId(order.from))).username
  }
  return orders
}

async function getOrderHandler (req, reply) {
  const { id } = req.params
  const order = await this.orderService.getOrder(this.transformStringIntoObjectId(id))
  if (order) {
    order.from = (await this.userService.getUser(this.transformStringIntoObjectId(order.from))).username
    return order
  } else {
    throw new Error(errors.NOT_FOUND)
  }
}

async function refuseOrderHandler (req, reply) {
  const { id } = req.params

  const order = await this.orderService.getOrder(this.transformStringIntoObjectId(id))
  if (!order) { throw new Error(errors.NOT_FOUND) }

  for await (const productObj of order.products) {
    await this.productService.changeQta(this.transformStringIntoObjectId(productObj.product), productObj.qta)
  }

  const results = await this.orderService.deleteOrder(this.transformStringIntoObjectId(id))
  if (results.ok) {
    reply.status(200).send()
  } else {
    throw new Error()
  }
}

async function deleteOrderHandler (req, reply) {
  const { id } = req.params
  const results = await this.orderService.deleteOrder(this.transformStringIntoObjectId(id))
  if (results.ok) {
    reply.status(200).send()
  } else {
    throw new Error()
  }
}
