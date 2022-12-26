const ModelsManager = require('../models_manager')
const { WarehouseRecord, Lot, Product } = ModelsManager.models

class Warehouse {
    #storage

    constructor(storage) {
        this.#storage = storage
    }

    async store(id) {
        const record = await WarehouseRecord.create({ storage_id: this.#storage.id, lot_number: id })
        return record.id
    }

    async retrieve(id) {
        const record = await WarehouseRecord.findOne({ where: { storage_id: this.#storage.id, lot_number: id } })

        if (!record) {
            return null
        }

        const lot = await Lot.findByPk(id)
        const product = await Product.findOne({ where: { lot_number: lot.id } })

        if (product?.status !== 1) {
            return false
        }

        return lot
    }
}

module.exports = Warehouse