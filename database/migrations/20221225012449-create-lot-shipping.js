'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LotShippings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      next_state: {
        type: Sequelize.INTEGER
      },
      shipping_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Shippings',
          key: 'id'
        }
      },
      lot_number: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Lots',
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
    await queryInterface.dropTable('LotShippings');
  }
};