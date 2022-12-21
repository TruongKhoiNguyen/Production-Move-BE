'use strict';

const Encryption = require('../../models/encryption');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let password = ''

    try {
      password = await Encryption.hash('123456')
    } catch (err) {
      password = err.message
    }

    return queryInterface.bulkInsert('users', [{
      email: 'tcook@apple.com',
      name: 'Tim Cook',
      password: password,
      role: 'executive',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
};
