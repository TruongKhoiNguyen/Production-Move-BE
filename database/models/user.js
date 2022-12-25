'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Warehouse, { foreignKey: 'user_id' })

      User.hasMany(models.Shipping, { as: 'from', foreignKey: 'from' })
      User.hasMany(models.Shipping, { as: 'to', foreignKey: 'to' })

      User.hasMany(models.Storage, { foreignKey: 'user_id' })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: [['executive', 'production', 'distribution', 'warranty']]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};