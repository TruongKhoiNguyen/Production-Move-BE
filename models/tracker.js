'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Tracker.belongsTo(models.Product, {
        foreignKey: 'product_id'
      })

      Tracker.hasOne(models.ManufacturedProduct)
      Tracker.hasOne(models.DistributingProduct)
      Tracker.hasOne(models.SoldProduct)
      Tracker.hasOne(models.RepairInWaitingProduct)
      Tracker.hasOne(models.RepairingProduct)
      Tracker.hasOne(models.DistributingProduct)
      Tracker.hasOne(models.RepairedProduct)
      Tracker.hasOne(models.DefectiveProduct)
    }
  }
  Tracker.init({
    product_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['manufactured', 'distributing', 'sold', 'repair in waiting', 'repairing', 'repaired', 'defected']]
      }
    }
  }, {
    sequelize,
    modelName: 'Tracker',
  });
  return Tracker;
};