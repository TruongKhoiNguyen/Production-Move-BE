'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DefectedProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DefectedProduct.init({
    tracker_id: DataTypes.INTEGER,
    distribution_agent_id: DataTypes.INTEGER,
    production_factory_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DefectedProduct',
  });
  return DefectedProduct;
};