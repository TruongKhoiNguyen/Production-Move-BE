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
      // define association here
    }

    static async checkDuplicated(name) {
      const result = await User.findAll({
        where: {
          name: name
        }
      })

      return result.length > 0 ? true : false
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'This is not an email address'
        }
      }
    },
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    location: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [['executive', 'production', 'distribution', 'warranty']],
          msg: 'This role does not exist'
        }
      },
      comment: 'Roles consist of Executive board, Production factory, Distribution agent and Warranty center'
    }
  }, {
    sequelize,
    modelName: 'User',
  });


  return User;
};