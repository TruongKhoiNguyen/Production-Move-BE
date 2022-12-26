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
      Product.hasOne(models.Sale, { foreignKey: 'product_id' })
      Product.hasMany(models.IndividualLogistics, { foreignKey: 'product_id' })
    }
  }
  Product.init({
    lot_number: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 9
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};