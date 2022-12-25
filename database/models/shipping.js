'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Shipping.belongsTo(models.User, { foreignKey: 'from' })
      Shipping.belongsTo(models.User, { foreignKey: 'to' })

      Shipping.hasOne(models.LotShipping, { foreignKey: 'shipping_id' })
    }
  }
  Shipping.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    received: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Shipping',
  });
  return Shipping;
};