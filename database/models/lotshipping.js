'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LotShipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LotShipping.belongsTo(models.Shipping, { foreignKey: 'shipping_id' })
      LotShipping.belongsTo(models.Lot, { foreignKey: 'lot_number' })
    }
  }
  LotShipping.init({
    next_state: DataTypes.INTEGER,
    shipping_id: DataTypes.INTEGER,
    lot_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LotShipping',
  });
  return LotShipping;
};