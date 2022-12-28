'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Sale.belongsTo(models.Customer, { foreignKey: 'customer_id' })
      Sale.belongsTo(models.Product, { foreignKey: 'product_id' })
      Sale.belongsTo(models.User, { foreignKey: 'distribution_id' })
    }
  }
  Sale.init({
    distribution_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Sale',
  });
  return Sale;
};