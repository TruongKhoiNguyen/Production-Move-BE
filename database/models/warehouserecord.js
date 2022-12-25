'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WarehouseRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  WarehouseRecord.init({
    storage_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Storages',
        key: 'id'
      }
    },
    lot_number: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Lots',
        key: 'id'
      }
    }

  }, {
    sequelize,
    modelName: 'WarehouseRecord',
  });
  return WarehouseRecord;
};