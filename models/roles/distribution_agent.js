const { Op } = require('sequelize')

const ModelsManager = require('../models_manager')
const Logistics = require('../logistics/logistics')
const Inventory = require('../storage/inventory')

const { Storage, Product, Logistics: PersistentLogistics, User, Sale, IndividualLogistics, InventoryRecord } = ModelsManager.models

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
        } else if (sender.role === 'warranty') {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findByPk(products[i])
                product.status = 6 /* Repaired */
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

    async receiveForRepairing(product_id, storage_id) {
        const product = await Product.findByPk(product_id)

        if (product.status !== 3 /* Sold */ && product.status !== 7 /* Recalling */) {
            throw new Error('This product is not in state of repairing')
        }

        const storage = await Storage.findByPk(storage_id)

        if (storage.user_id !== this.distributionAgent.id) {
            throw new Error('This storage does not belong to this user')
        }

        try {
            const inventory = new Inventory(storage)
            await inventory.store(product_id)

            let result = ''
            if (product.status === 3) {
                product.status = 4 /* Repair in waiting */
                result = 'repair'
            } else if (product.status === 7) {
                product.status = 8 /* Recalled */
                result = 'recalled'
            }

            await product.save()
            return result

        } catch (err) {
            throw err
        }
    }

    async sendForRepair(product_id, warranty_center) {
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

        if (product.status !== 4 /* Repair in waiting */) {
            throw new Error('This product is not for repair')
        }

        const receiver = await User.findByPk(warranty_center)

        if (receiver.role !== 'warranty') {
            throw new Error('Receiver is not a warranty center')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const logistics = await PersistentLogistics.create(
                    { from: this.distributionAgent.id, to: warranty_center, type: 'individual' },
                    { transaction: t }
                )

                await IndividualLogistics.create({ delivery_id: logistics.id, product_id: product.id }, { transaction: t })

                product.status = 0 /* Shipping */
                product.save()

                return logistics.id
            })

            return result
        } catch (err) {
            throw err
        }
    }

    async returnToCustomer(product_id, customer_id) {
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

        if (product.status !== 6) {
            throw new Error('This product can not be returned')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const sale = await Sale.findOne({ where: { product_id: product_id }, transaction: t })
                await Product.update({ status: 3 /* Sold */ }, { where: { id: product_id }, transaction: t })

                return sale.id
            })

            return result
        } catch (err) {
            throw err
        }
    }

    async recall(lot_number) {
        const product = await Product.findOne({ where: { lot_number: lot_number } })
        const storages = await Storage.findAll({ where: { user_id: this.distributionAgent.id } })

        let isRecordExist = false
        for (let i = 0; i < storages.length; i++) {
            const record = await InventoryRecord.findOne({ where: { storage_id: storages[i].id, products_id: product.id } })
            if (record) {
                isRecordExist = true
                break
            }
        }

        if (!isRecordExist) {
            throw new Error('This distribution agent does not sell this lot')
        }

        try {
            await sequelize.transaction(async (t) => {
                const products = await Product.findAll({ where: { lot_number: lot_number } })

                const productsInInventory = products.filter(product => product.status === 2 || product.status === 4 || product.status === 6)
                const recalledProductId = productsInInventory.map(product => product.id)

                const recallingProductId = products.map(product => product.id).filter(id => !recalledProductId.includes(id))

                await Product.update({ status: 7 /* Recalling */ }, { where: { id: { [Op.in]: recallingProductId } }, transaction: t })
                await Product.update({ status: 8 /* Recalled */ }, { where: { id: { [Op.in]: recalledProductId } }, transaction: t })
            })

        } catch (err) {
            throw err
        }
    }
}

module.exports = DistributionAgent