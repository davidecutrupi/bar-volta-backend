'use strict'

//
//

const addUser = {

  body: {
    type: 'object',
    required: ['username', 'password', 'role'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$' },
      role: { type: 'string', enum: ['student', 'seller', 'admin'] }
    },
    additionalProperties: false
  }

}

const login = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$' }
    },
    additionalProperties: false
  }
}

const getUser = {

  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    },
    additionalProperties: false
  },

  response: {
    200: {
      type: 'object',
      required: ['_id', 'username'],
      properties: {
        _id: { type: 'string' },
        username: { type: 'string' }
      },
      additionalProperties: false
    }
  }

}

const getUserOrders = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        required: ['_id', 'from', 'products', 'createdAt', 'confirmed'],
        properties: {
          _id: { type: 'string' },
          from: { type: 'string' },
          products: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['product', 'qta'],
              properties: {
                product: { type: 'string' },
                qta: { type: 'integer', minimum: 1 }
              },
              additionalProperties: false
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          confirmed: { type: 'boolean' }
        },
        additionalProperties: false
      }
    }
  }
}

module.exports = {
  addUser,
  login,
  getUser,
  getUserOrders
}
