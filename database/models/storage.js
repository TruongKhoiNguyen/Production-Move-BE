'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Storage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Storage.belongsTo(models.User, { foreignKey: 'user_id' })
      Storage.belongsToMany(models.Lot, { through: models.WarehouseRecord, foreignKey: 'storage_id', otherKey: 'lot_number' })
    }
  }
  Storage.init({
    user_id: DataTypes.INTEGER,
    location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Storage',
  });
  return Storage;
};