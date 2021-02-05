'use strict'

//
//

const addProduct = {
  body: {
    type: 'object',
    required: ['name', 'qta', 'description', 'photo', 'price'],
    properties: {
      name: { type: 'string', maxLength: 60 },
      qta: { type: 'integer', minimum: 0 },
      description: { type: 'string' },
      photo: { type: 'string' },
      price: { type: 'number', exclusiveMinimum: 0 }
    },
    additionalProperties: false
  }
}

const getAllProducts = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        required: ['_id', 'name', 'qta', 'description', 'photo', 'price'],
        properties: {
          _id: { type: 'string' },
          name: { type: 'string', maxLength: 60 },
          qta: { type: 'integer', minimum: 0 },
          description: { type: 'string' },
          photo: { type: 'string' },
          price: { type: 'number', exclusiveMinimum: 0 }
        },
        additionalProperties: false
      }
    }
  }
}

const getProduct = {

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
      required: ['_id', 'name', 'qta', 'description', 'photo', 'price'],
      properties: {
        _id: { type: 'string' },
        name: { type: 'string', maxLength: 60 },
        qta: { type: 'integer', minimum: 0 },
        description: { type: 'string' },
        photo: { type: 'string' },
        price: { type: 'number', exclusiveMinimum: 0 }
      },
      additionalProperties: false
    }
  }

}

const editProduct = {

  body: {
    type: 'object',
    required: ['name', 'qta', 'description', 'photo', 'price'],
    properties: {
      name: { type: 'string', maxLength: 60 },
      qta: { type: 'integer', minimum: 0 },
      description: { type: 'string' },
      photo: { type: 'string' },
      price: { type: 'number', exclusiveMinimum: 0 }
    },
    additionalProperties: false
  },
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
      required: ['name', 'qta', 'description', 'photo', 'price'],
      properties: {
        name: { type: 'string', maxLength: 60 },
        qta: { type: 'integer', minimum: 0 },
        description: { type: 'string' },
        photo: { type: 'string' },
        price: { type: 'number', exclusiveMinimum: 0 }
      },
      additionalProperties: false
    }
  }

}

const deleteProduct = {
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
  addProduct,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct
}
