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
      Product.hasMany(models.Tracker)
    }
  }
  Product.init({
    product_line: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['iphone', 'ipad', 'mac']]
      }
    },
    model: DataTypes.STRING,
    lot_number: DataTypes.STRING,
    serial_number: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};