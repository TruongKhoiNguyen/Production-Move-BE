const { QueryTypes } = require('sequelize')

const Logistics = require('../logistics/logistics')
const ModelsManager = require('../models_manager')
const Inventory = require('../storage/inventory')

const { Storage, Product, User, Logistics: PersistentLogistics, IndividualLogistics } = ModelsManager.models
const sequelize = ModelsManager.connection

class WarrantyCenter {
    user

    constructor(user) {
        if (user.role !== 'warranty') {
            throw new Error('This user is not warranty center')
        }

        this.user = user
    }

    async receive(delivery_id, storage_id) {
        const storage = await Storage.findByPk(storage_id)

        if (storage.user_id !== this.user.id) {
            throw new Error('This storage does not belong to this user')
        }

        const logistics = new Logistics(this.user)

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

    async send(product_id, to) {
        const storages = await Storage.findAll({ where: { user_id: this.user.id } })

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

        const receiver = await User.findByPk(to)

        if (receiver.role !== 'distribution') {
            throw new Error('Receiver is not a distribution agent')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const logistics = await PersistentLogistics.create({ from: this.user.id, to: to, type: 'individual' }, { transaction: t })
                await IndividualLogistics.create({ delivery_id: logistics.id, product_id: product_id }, { transaction: t })

                await Product.update({ status: 0 /* Shipping */ }, { where: { id: product_id }, transaction: t })

                return logistics.id
            })

            return result

        } catch (err) {
            throw err
        }
    }

    async returnToFactory(product_id) {
        const storages = await Storage.findAll({ where: { user_id: this.user.id } })

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

        await Product.update({ status: 7/* Recalling */ }, { where: { id: product_id } })
    }

    async getProduct() {
        const query = 'SELECT * FROM Products WHERE id in (SELECT products_id FROM InventoryRecords WHERE storage_id in (SELECT id FROM Storages WHERE user_id = :user_id)) AND status in (5, 7)';

        const result = await sequelize.query(query, {
            replacements: { user_id: this.user.id },
            type: QueryTypes.SELECT
        })

        return result
    }
}

module.exports = WarrantyCenter