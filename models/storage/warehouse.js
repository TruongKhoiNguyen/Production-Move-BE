const ModelsManager = require('../models_manager')
const { WarehouseRecord } = ModelsManager.models

class Warehouse {
    #storage

    constructor(storage) {
        this.#storage = storage
    }

    async store(id) {
        const record = await WarehouseRecord.create({ storage_id: this.#storage.id, lot_number: id })
        return record.id
    }
}

module.exports = Warehouse