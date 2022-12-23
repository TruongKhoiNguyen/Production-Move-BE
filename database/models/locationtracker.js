'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LocationTracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LocationTracker.belongsTo(models.Lot, { foreignKey: 'lot_number' })
      LocationTracker.belongsTo(models.Warehouse, { foreignKey: 'warehouse_id' })
    }
  }
  LocationTracker.init({
    lot_number: DataTypes.INTEGER,
    warehouse_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LocationTracker',
  });
  return LocationTracker;
};