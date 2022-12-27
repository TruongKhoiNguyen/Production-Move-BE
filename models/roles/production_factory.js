const ModelsManager = require('../models_manager')
const Logistics = require('../logistics/logistics')
const Inventory = require('../storage/inventory')
const Warehouse = require('../storage/warehouse')
const { Op } = require('sequelize')

const { Storage, Product, Logistics: PersistentLogistics, LotLogistics, User } = ModelsManager.models
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

    async send(lot_number, to) {
        const storages = await Storage.findAll({ where: { user_id: this.user.id } })

        let lot
        for (let i = 0; i < storages.length; i++) {
            const warehouse = new Warehouse(storages[i])
            const tempLot = await warehouse.retrieve(lot_number)

            if (tempLot) {
                lot = tempLot
                break
            }
        }

        if (!lot) {
            throw new Error('This lot is not in warehouse')
        }

        const receiver = await User.findByPk(to)

        if (receiver.role !== 'distribution') {
            throw new Error('Receiver is not a distribution agent')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const logistics = await PersistentLogistics.create({ from: this.user.id, to: to, type: 'lot' }, { transaction: t })
                await LotLogistics.create({ delivery_id: logistics.id, lot_number: lot_number }, { transaction: t })

                await Product.update({ status: 0 /* Shipping */ }, { where: { lot_number: lot_number }, transaction: t })

                return logistics.id
            })

            return result


        } catch (err) {
            throw err
        }
    }
}

module.exports = ProductionFactory