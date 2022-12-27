const Logistics = require('../logistics/logistics')
const ModelsManager = require('../models_manager')
const Inventory = require('../storage/inventory')

const { Storage, Product, User, Logistics: PersistentLogistics, IndividualLogistics } = ModelsManager.models
const sequelize = ModelsManager.connection

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

    async send(product_id, distribution_id) {
        const storages = await Storage.findAll({ where: { user_id: this.warrantyCenter.id } })

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

        if (product.status !== 5 /* Repairing */) {
            throw new Error('This product is not repaired')
        }

        const receiver = await User.findByPk(distribution_id)

        if (receiver.role !== 'distribution') {
            throw new Error('Receiver is not a distribution agent')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const logistics = await PersistentLogistics.create({ from: this.warrantyCenter.id, to: distribution_id, type: 'individual' }, { transaction: t })
                await IndividualLogistics.create({ delivery_id: logistics.id, product_id: product_id }, { transaction: t })

                await Product.update({ status: 0 /* Shipping */ }, { where: { id: product_id }, transaction: t })

                return logistics.id
            })

            return result

        } catch (err) {
            throw err
        }
    }
}

module.exports = WarrantyCenter