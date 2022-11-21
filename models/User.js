const db = require('../database/models/index')
const sequelize = db.sequelize
const userTable = sequelize.models.User

class User {
    id = -1
    name
    password

    constructor(name, password) {
        this.name = name
        this.password = password
    }

    async create() {
        let result = {}

        try {
            const data = await userTable.create({ name: this.name, password: this.password })
            result = { success: true, data: data, message: 'User created successfully' }
        } catch (err) {
            result = { success: false, error: err }
        }

        return result;
    }

    static async checkDuplicated(name) {
        const result = await User.find(name)
        return Boolean(result)
    }

    static async find(name) {
        let result = []

        result = await userTable.findAll({
            where: {
                name: name
            }
        })

        if (result.length > 0) {
            const user = new User(result[0].name, result[0].password)
            user.id = result[0].id

            return user;
        }

        return null;
    }

    get db() {
        return userTable
    }
}

module.exports = User