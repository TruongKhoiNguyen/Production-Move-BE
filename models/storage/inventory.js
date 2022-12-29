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

        if (product.status !== 2 && product.status !== 4 && product.status !== 5 && product.status !== 6) {
            return null
        }

        return product
    }

    ioStore(productIds) {
        return (async (transaction) => {
            try {
                await InventoryRecord.bulkCreate(productIds.map((id) => ({ storage_id: this.storage.id, products_id: id })), { transaction: transaction })
            } catch (err) {
                throw err
            }
        })
    }
}

module.exports = Inventory