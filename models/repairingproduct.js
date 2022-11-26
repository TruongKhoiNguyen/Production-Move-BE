'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RepairingProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RepairingProduct.belongsTo(models.User, {
        foreignKey: 'warranty_center_id'
      })
    }
  }
  RepairingProduct.init({
    tracker_id: DataTypes.INTEGER,
    warranty_center_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RepairingProduct',
  });
  return RepairingProduct;
};