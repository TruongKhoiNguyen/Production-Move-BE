'use strict';

const { hashPassword } = require('../../utils/hash');

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
    }])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
};
