'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IndividualLogistics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      IndividualLogistics.belongsTo(models.Logistics, { foreignKey: 'delivery_id' })
      IndividualLogistics.belongsTo(models.Product, { foreignKey: 'product_id' })
    }
  }
  IndividualLogistics.init({
    delivery_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'IndividualLogistics',
  });
  return IndividualLogistics;
};