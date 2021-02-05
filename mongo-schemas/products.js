'use strict'

module.exports = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'qta', 'description', 'photo', 'price'],
    properties: {
      name: { bsonType: 'string', maxLength: 60 },
      qta: { bsonType: 'int', minimum: 0 },
      description: { bsonType: 'string' },
      photo: { bsonType: 'string' },
      price: { bsonType: 'number', minimum: 0 }
    }
  }
}
