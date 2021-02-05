'use strict'

const fp = require('fastify-plugin')
const bcrypt = require('bcrypt')

module.exports = fp(async function (fastify, opts, next) {
  // Function to generate a password
  const hash = async pwd => await bcrypt.hash(pwd, 10)

  // Functon to compare two passwords
  const compare = async (plainPass, hashedPass) => await bcrypt.compare(plainPass, hashedPass)

  fastify.decorate('bcrypt', { hash, compare })

  next()
})
