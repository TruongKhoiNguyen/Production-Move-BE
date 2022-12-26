'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LotLogistics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LotLogistics.belongsTo(models.Logistics, { foreignKey: 'delivery_id' })
      LotLogistics.belongsTo(models.Lot, { foreignKey: 'lot_number' })
    }
  }
  LotLogistics.init({
    delivery_id: DataTypes.INTEGER,
    lot_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LotLogistics',
  });
  return LotLogistics;
};