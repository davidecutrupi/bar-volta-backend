'use strict'

module.exports = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['username', 'password', 'role'],
    properties: {
      username: { bsonType: 'string' },
      password: { bsonType: 'string' },
      role: { enum: ['student', 'seller', 'admin'] }
    }
  }
}
