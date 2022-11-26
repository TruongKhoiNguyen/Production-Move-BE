'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RepairedProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RepairedProduct.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_id'
      })

      RepairedProduct.belongsTo(models.Tracker, {
        foreignKey: 'tracker_id'
      })
    }
  }
  RepairedProduct.init({
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RepairedProduct',
  });
  return RepairedProduct;
};