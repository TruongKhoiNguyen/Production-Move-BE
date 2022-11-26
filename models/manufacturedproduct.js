'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ManufacturedProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ManufacturedProduct.belongsTo(models.User, {
        foreignKey: 'factory_id'
      })

      ManufacturedProduct.belongsTo(models.Tracker, {
        foreignKey: 'tracker'
      })
    }
  }
  ManufacturedProduct.init({
    tracker: DataTypes.INTEGER,
    factory_id: DataTypes.INTEGER,
    manufacturing_date: DataTypes.DATEONLY,
    issue_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'ManufacturedProduct',
  });
  return ManufacturedProduct;
};