'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logistics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Logistics.belongsTo(models.User, { foreignKey: 'from' })
      Logistics.belongsTo(models.User, { foreignKey: 'to' })

      Logistics.hasOne(models.LotLogistics, { foreignKey: 'delivery_id' })
    }
  }
  Logistics.init({
    from: DataTypes.INTEGER,
    to: DataTypes.INTEGER,
    received: DataTypes.BOOLEAN,
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['lot', 'batch', 'individual']]
      }
    }
  }, {
    sequelize,
    modelName: 'Logistics',
  });
  return Logistics;
};