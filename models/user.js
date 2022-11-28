const { DataTypes } = require('sequelize')
const Warehouse = require('./warehouse')
const sequelize = require('../database/models/index').sequelize

const User = sequelize.define('User', {
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
  tableName: 'users'
})

// associations
User.associate = (models) => {
  User.hasMany(models.Warehouse, { foreign_key: 'user_id' })
}


// methods
User.checkDuplicated = async (name) => {
  const user = await User.findAll({
    where: {
      name: name
    }
  })

  return user.length > 0 ? true : false
}

User.sync()

module.exports = User