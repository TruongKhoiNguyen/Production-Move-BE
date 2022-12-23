'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Lot, { foreignKey: 'lot_number' })
    }
  }
  Product.init({
    lot_number: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 13
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};