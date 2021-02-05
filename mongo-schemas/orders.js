'use strict'

module.exports = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['products', 'from', 'createdAt', 'confirmed'],
    properties: {
      from: { bsonType: 'objectId' },
      createdAt: { bsonType: 'date' },
      confirmed: { bsonType: 'bool' },
      products: {
        bsonType: 'array',
        minItems: 1,
        items: {
          bsonType: 'object',
          required: ['product', 'qta'],
          properties: {
            product: { bsonType: 'objectId' },
            qta: { bsonType: 'int', minimum: 0 }
          }
        }
      }
    }
  }
}
