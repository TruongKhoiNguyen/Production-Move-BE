const ModelsManager = require('../models_manager')

const { InventoryRecord, Product } = ModelsManager.models

class Inventory {
    storage

    constructor(storage) {
        this.storage = storage
    }

    async store(id) {
        const result = await InventoryRecord.create({ storage_id: this.storage.id, products_id: id })
        return result.id
    }

    async retrieve(id) {
        const record = await InventoryRecord.findOne({ where: { storage_id: this.storage.id, products_id: id }, order: [['createdAt', 'DESC']] })

        if (!record) {
            return null
        }

        const product = await Product.findByPk(record.products_id)

        if (product.status !== 2 && product.status !== 4 && product.status !== 5) {
            return null
        }

        return product
    }
}

module.exports = Inventory