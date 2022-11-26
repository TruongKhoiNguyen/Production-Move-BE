'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoldProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SoldProduct.init({
    tracker_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
    sold_date: DataTypes.DATEONLY,
    warranty_expire_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'SoldProduct',
  });
  return SoldProduct;
};