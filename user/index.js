'use strict'

const {
  addUser: addUserSchema,
  login: loginSchema,
  getUser: getUserSchema,
  getMyOrders: getMyOrdersSchema
} = require('./schemas')

const errors = require('../errors')

module.exports = async function (fastify) {
  //
  // Wrappers
  await fastify.register(require('../wrappers/bcrypt'))

  //
  // Error handler
  await fastify.setErrorHandler(async function (error, req, reply) {
    if (error.message === errors.INVALID_USERNAME) {
      reply.status(403).send(error)
    } else if (error.message === errors.WRONG_PASSWORD) {
      reply.status(401).send(error)
    } else if (error.message === errors.USERNAME_IS_NOT_AVAILABLE) {
      reply.status(400).send(error)
    } else if (error.message === errors.NOT_FOUND) {
      reply.status(400).send(error)
    } else {
      reply.status(500).send(error)
    }
  })

  //
  // Api da non loggato
  fastify.post('/login', { schema: loginSchema }, loginHandler)

  //
  // Api da loggato
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)

    fastify.get('/:id', { schema: getUserSchema }, getUserHandler)
    fastify.get('/orders', { schema: { getMyOrdersSchema } }, getMyOrdersHandler)
    fastify.get('/logout', { schema: {} }, logoutHandler)
  })

  //
  // Only Admin
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)
    fastify.addHook('preHandler', fastify.onlyAdmin)

    fastify.post('/', { schema: addUserSchema }, addUserHandler)
    fastify.delete('/', { schema: {} }, deleteUserHandler)
  })
}

//
// Decorators
module.exports[Symbol.for('plugin-meta')] = {
  decorators: {
    fastify: [
      'authPreHandler',
      'onlySellers',
      'onlyAdmin',
      'userService',
      'orderService',
      'jwt',
      'transformStringIntoObjectId'
    ]
  }
}

//
// Handlers
async function addUserHandler (req, reply) {
  const { body } = req
  const newUser = (await this.userService.addUser(body, this.bcrypt.hash)).ops[0]
  delete newUser.password
  return newUser
}

async function loginHandler (req, reply) {
  const { body } = req
  const user = await this.userService.login(body, this.bcrypt.compare)

  // TODO __Host-user_session
  const jwt = await this.jwt.sign({ _id: user._id, role: user.role, username: user.username })
  reply.setCookie('user_session', jwt, {
    httpOnly: true,
    secure: false,
    domain: 'login',
    path: '/',
    sameSite: true,
    maxAge: 31536000
  }).send()
}

async function getUserHandler (req, reply) {
  const { id } = req.params
  const user = await this.userService.getUser(this.transformStringIntoObjectId(id))
  if (user) {
    return user
  } else {
    throw new Error(errors.NOT_FOUND)
  }
}

async function getMyOrdersHandler (req, reply) {
  const { _id, username } = req.payload
  const orders = await this.orderService.getUserOrders(this.transformStringIntoObjectId(_id))
  orders.forEach(obj => { obj.from = username })
  return orders
}

async function logoutHandler (req, reply) {
  reply.setCookie('user_session', '', {
    httpOnly: true,
    secure: false,
    domain: '192.168.1.92',
    path: '/',
    sameSite: true,
    maxAge: 0
  }).send()
}

async function deleteUserHandler (req, reply) {
  const { _id } = req.payload
  const results = await this.userService.deleteUser(this.transformStringIntoObjectId(_id))
  if (results.ok) {
    reply.status(200).send()
  } else {
    throw new Error()
  }
}
