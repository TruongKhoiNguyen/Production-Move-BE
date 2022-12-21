const ModelsManager = require('./models_manager')

class UsersManager {
    static #User = ModelsManager.models.User

    static get User() {
        return this.#User
    }

    static async checkDuplicated(name) {
        const users = await this.#User.findAll({ where: { name: name } })

        if (users.length === 0) {
            return false
        }

        return true
    }
}

module.exports = UsersManager