'use strict';

const Encryption = require('../../models/encryption');

const hashPassword = async (password) => {
  let hash = ''

  try {
    hash = await Encryption.hash('123456')
  } catch (err) {
    hash = err.message
  }

  return hash
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      email: 'tcook@apple.com',
      name: 'Tim Cook',
      password: await hashPassword('123456'),
      role: 'executive',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      email: 'chennai@pegatroncorp.com',
      name: 'Chennai',
      password: await hashPassword('123456'),
      role: 'production',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'marunochi@apple.com',
      name: 'Marunochi Store',
      password: await hashPassword('123456'),
      role: 'distribution',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: 'shinjuku-care@apple.com',
      name: 'Shinjuku Warranty Center',
      password: await hashPassword('123456'),
      role: 'warranty',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
};
