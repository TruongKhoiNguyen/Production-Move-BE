'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lot.belongsTo(models.ProductModel, { foreignKey: 'model' })

      Lot.hasMany(models.Product, { foreignKey: 'lot_number' })

      Lot.belongsToMany(models.Storage, { through: models.WarehouseRecord, foreignKey: 'lot_number', otherKey: 'storage_id' })

      Lot.hasMany(models.LotLogistics, { foreignKey: 'lot_number' })
    }
  }
  Lot.init({
    model: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lot',
  });
  return Lot;
};