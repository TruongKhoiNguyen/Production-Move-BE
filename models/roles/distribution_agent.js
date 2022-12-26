const ModelsManager = require('../models_manager')
const Logistics = require('../logistics/logistics')
const Inventory = require('../storage/inventory')

const { Storage, Product, Logistics: PersistentLogistics, User } = ModelsManager.models

class DistributionAgent {
    distributionAgent

    constructor(user) {
        if (user.role !== 'distribution') {
            throw new Error('This user is not a distribution agent')
        }

        this.distributionAgent = user
    }

    async receive(delivery_id, storage_id) {
        const storage = await Storage.findByPk(storage_id)

        if (storage.user_id !== this.distributionAgent.id) {
            throw new Error('This storage does not belong to this user')
        }

        const logistics = new Logistics(this.distributionAgent)
        const products = await logistics.get(delivery_id)

        const inventory = new Inventory(storage)
        for (let i = 0; i < products.length; i++) {
            await inventory.store(products[i])
        }

        const delivery = await PersistentLogistics.findByPk(delivery_id)
        const senderId = delivery.from
        const sender = await User.findByPk(senderId)

        if (sender.role === 'production') {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findByPk(products[i])
                product.status = 2
                product.save()
            }
        }
    }
}

module.exports = DistributionAgent