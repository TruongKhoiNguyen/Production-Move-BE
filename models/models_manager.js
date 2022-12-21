const connection = require('../database/models/index')

class ModelsManager {
    static #connection = connection

    static get models() {
        return this.#connection.sequelize.models
    }
}

module.exports = ModelsManager