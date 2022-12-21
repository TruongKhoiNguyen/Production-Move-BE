'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProductModel.init({
    product_line: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['iphone', 'ipad', 'macintosh']]
      }
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductModel',
  });
  return ProductModel;
};