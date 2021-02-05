'use strict'

//
//

const addOrder = {
  body: {
    type: 'object',
    required: ['products'],
    properties: {
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
      }
    },
    additionalProperties: false
  }
}

const getAllOrders = {
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

const getOrder = {

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

const confirmOrder = {

  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    },
    additionalProperties: false
  },

  response: {
    200: {}
  }

}

const deleteOrder = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    },
    additionalProperties: false
  },

  response: {
    200: {}
  }
}

//
//

module.exports = {
  addOrder,
  getAllOrders,
  getOrder,
  confirmOrder,
  deleteOrder
}
