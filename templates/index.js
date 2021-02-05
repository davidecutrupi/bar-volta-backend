'use strict'

module.exports = async function (fastify) {
  fastify.get('/login', getLoginPage)
  //
  // Api da loggato
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)
  })

  //
  // Solo admin e sellers
  await fastify.register(async function (fastify) {
    fastify.addHook('preHandler', fastify.authPreHandler)
    fastify.addHook('preHandler', fastify.onlySellers)
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
async function getLoginPage (req, reply) {
  const templateData = {
    title: 'Accedi - bar iis volta'
  }
  return reply.view('./login.ejs', templateData)
}
