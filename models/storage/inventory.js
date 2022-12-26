const ModelsManager = require('../models_manager')

const { InventoryRecord } = ModelsManager.models

class Inventory {
    storage

    constructor(storage) {
        this.storage = storage
    }

    async store(id) {
        const result = await InventoryRecord.create({ storage_id: this.storage.id, products_id: id })
        return result.id
    }
}

module.exports = Inventory