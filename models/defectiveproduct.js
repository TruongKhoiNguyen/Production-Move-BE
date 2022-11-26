'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DefectiveProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DefectiveProduct.belongsTo(models.User, {
        as: 'distribution_agent',
        foreignKey: 'distribution_agent_id'
      })

      DefectiveProduct.belongsTo(models.User, {
        as: 'production_factory',
        foreignKey: 'production_factory_id'
      })

      DefectiveProduct.belongsTo(models.Tracker, {
        foreignKey: 'tracker_id'
      })
    }
  }
  DefectiveProduct.init({
    tracker_id: DataTypes.INTEGER,
    distribution_agent_id: DataTypes.INTEGER,
    production_factory_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DefectiveProduct',
  });
  return DefectiveProduct;
};