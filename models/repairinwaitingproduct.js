'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RepairInWaitingProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RepairInWaitingProduct.belongsTo(models.Warehouse, {
        foreignKey: 'warehouse_id'
      })

      RepairInWaitingProduct.belongsTo(models.Tracker, {
        foreignKey: 'tracker_id'
      })
    }
  }
  RepairInWaitingProduct.init({
    tracker_id: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RepairInWaitingProduct',
  });
  return RepairInWaitingProduct;
};