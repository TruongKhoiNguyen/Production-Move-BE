const { sequelize } = require('../database/models/index')

class ModelsManager {
    #models = {}

    constructor() {
        this.#models = {}
    }

    register(name, model) {
        this.#models[name] = model
    }

    setup() {
        Object.values(this.#models).forEach(model => model.setup(this.#models))
        sequelize.sync()
    }

    get models() {
        return this.#models
    }
}

module.exports = ModelsManager