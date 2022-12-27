const ModelsManager = require('../models_manager')
const Logistics = require('../logistics/logistics')
const Inventory = require('../storage/inventory')
const { Op } = require('sequelize')

const { Storage, Product } = ModelsManager.models
const sequelize = ModelsManager.connection

class ProductionFactory {
    user

    constructor(user) {
        if (user.role !== 'production') {
            throw new Error('This user is not a production factory')
        }

        this.user = user
    }

    async receive(delivery_id, storage_id) {
        const storage = await Storage.findByPk(storage_id)

        if (storage.user_id !== this.user.id) {
            throw new Error('This storage does not belong to this user')
        }

        const logistics = new Logistics(this.user)
        const products = await logistics.get(delivery_id)

        const inventory = new Inventory(storage)
        for (let i = 0; i < products.length; i++) {
            await inventory.store(products[i])
        }

        try {
            await sequelize.transaction(async (t) => {
                await Product.update({ status: 9 /* Returned */ }, { where: { id: { [Op.in]: products } }, transaction: t })
            })

        } catch (err) {
            throw err
        }
    }
}

module.exports = ProductionFactory