'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DistributingProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DistributingProduct.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_id'
      })

      DistributingProduct.belongsTo(models.Tracker, {
        foreignKey: 'tracker_id'
      })
    }
  }
  DistributingProduct.init({
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DistributingProduct',
  });
  return DistributingProduct;
};