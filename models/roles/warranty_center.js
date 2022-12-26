const Logistics = require('../logistics/logistics')
const ModelsManager = require('../models_manager')
const Inventory = require('../storage/inventory')

const { Storage, Product } = ModelsManager.models

class WarrantyCenter {
    warrantyCenter

    constructor(user) {
        if (user.role !== 'warranty') {
            throw new Error('This user is not warranty center')
        }

        this.warrantyCenter = user
    }

    async receive(delivery_id, storage_id) {
        const storage = await Storage.findByPk(storage_id)

        if (storage.user_id !== this.warrantyCenter.id) {
            throw new Error('This storage does not belong to this user')
        }

        const logistics = new Logistics(this.warrantyCenter)

        try {
            const products = await logistics.get(delivery_id)
            const productId = products[0]

            const inventory = new Inventory(storage)
            await inventory.store(productId)

            const product = await Product.findByPk(productId)
            product.status = 5 /* Repairing */
            await product.save()

        } catch (err) {
            throw err
        }
    }
}

module.exports = WarrantyCenter