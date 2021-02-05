'use strict'

const fp = require('fastify-plugin')
const path = require('path')

// Importo i services
const UserService = require('./user/service')
const ProductService = require('./product/service')
const OrderService = require('./order/service')

//
//
//

async function connectToDatabase (fastify) {
  if (process.env.NODE_ENV === 'dev') {
    await fastify.register(require('fastify-mongodb'), { url: 'mongodb://localhost/bar', useNewUrlParser: true })
  } else {
    await fastify.register(require('fastify-mongodb'), { url: fastify.config.MONGODB_URL, useNewUrlParser: true })
  }
}

function transformStringIntoObjectId (str) {
  try {
    return new this.mongo.ObjectId(str)
  } catch (e) {
    return ''
  }
}

async function decorateFastifyInstance (fastify) {
  const db = fastify.mongo.db

  // Mongo collections
  const userCollection = await db.collection('users') || await db.createCollection('users')
  const productCollection = await db.collection('products') || await db.createCollection('products')
  const orderCollection = await db.collection('orders') || await db.createCollection('orders')

  // User service
  const userService = new UserService(userCollection)
  await userService.ensureIndex(db)
  fastify.decorate('userService', userService)

  // Product service
  const productService = new ProductService(productCollection)
  await productService.ensureIndex(db)
  fastify.decorate('productService', productService)

  // Order service
  const orderService = new OrderService(orderCollection)
  await orderService.ensureIndex(db)
  fastify.decorate('orderService', orderService)

  //
  //
  // Other decoratos
  fastify.decorate('authPreHandler', async function auth (req, reply) {
    try {
      const decoded = await req.jwtVerify()
      req.payload = decoded
    } catch (err) {
      reply.send(err)
    }
  })

  fastify.decorate('onlySellers', async function auth (req, reply) {
    if (req.payload.role !== 'seller' && req.payload.role !== 'admin') {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'You are unauthorized'
      })
    }
  })

  fastify.decorate('onlyAdmin', async function (req, reply) {
    if (req.payload.role !== 'admin') {
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Authorization token is invalid: invalid signature'
      })
    }
  })

  fastify.decorate('transformStringIntoObjectId', transformStringIntoObjectId)
}

module.exports = async function (fastify, opts) {
  await fastify
    .register(require('fastify-env'), { schema: {} })
    .register(require('fastify-cookie'))
    .register(require('fastify-jwt'), { secret: process.env.JWT_SECRET, cookie: { cookieName: 'user_session' } })
    .register(fp(connectToDatabase))
    .register(fp(decorateFastifyInstance))

    // Router
    .register(require('./user'), { prefix: '/api/user' })
    .register(require('./product'), { prefix: '/api/product' })
    .register(require('./order'), { prefix: '/api/order' })

  // Frontend
  await fastify.register(require('point-of-view'), {
    engine: { ejs: require('ejs') },
    root: path.join(__dirname, 'templates')
  }).register(require('./templates/index'))
}
