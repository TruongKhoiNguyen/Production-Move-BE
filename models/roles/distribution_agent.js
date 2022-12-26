const ModelsManager = require('../models_manager')
const Logistics = require('../logistics/logistics')
const Inventory = require('../storage/inventory')

const { Storage, Product, Logistics: PersistentLogistics, User, Sale } = ModelsManager.models

const sequelize = ModelsManager.connection

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

    async sell(product_id, customer_id) {
        const storages = await Storage.findAll({ where: { user_id: this.distributionAgent.id } })

        let product
        for (let i = 0; i < storages.length; i++) {
            const inventory = new Inventory(storages[i])
            const tempProduct = await inventory.retrieve(product_id)

            if (tempProduct) {
                product = tempProduct
                break
            }
        }

        if (!product) {
            throw new Error('This product is not in inventory')
        }

        if (product.status !== 2) {
            throw new Error('This product can not be sold')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const sale = await Sale.create({ product_id: product_id, customer_id: customer_id }, { transaction: t })

                product.status = 3 /* Sold */
                await product.save({ transaction: t })

                return sale.id
            })

            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = DistributionAgent