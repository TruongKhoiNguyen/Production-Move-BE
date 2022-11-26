'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DistributingProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tracker_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tracker',
          key: 'id'
        }
      },
      warehouse_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Warehouse',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DistributingProducts');
  }
};