'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tracker.init({
    product_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['manufactured', 'distributing', 'sold', 'repair in waiting', 'repairing', 'repaired', 'defected']]
      }
    }
  }, {
    sequelize,
    modelName: 'Tracker',
  });
  return Tracker;
};