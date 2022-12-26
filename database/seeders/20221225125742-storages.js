'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Storages', [{
      user_id: 2,
      location: 'Chennai, India',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      user_id: 3,
      location: 'Marunouchi, Chiyoda-ku, Tokyo, Japan',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      user_id: 4,
      location: 'Nishi-Shinsaibashi, Chuo-ku, Osaku-fu, Japan',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Storages', null, {});
  }
};
