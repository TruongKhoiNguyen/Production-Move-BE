'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('Shippings', 'previous_state', Sequelize.INTEGER)
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeColumn('Shippings', 'previous_state', Sequelize.INTEGER)
  }
};
