const ModelsManager = require('../models_manager')
const Logistics = require('../logistics/logistics')
const Inventory = require('../storage/inventory')
const Warehouse = require('../storage/warehouse')
const { Op, QueryTypes } = require('sequelize')

const { Storage, Product, Logistics: PersistentLogistics, LotLogistics, User, Lot, WarehouseRecord } = ModelsManager.models
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

    async manufacture(model, amount, storage_id) {
        const storage = await Storage.findByPk(storage_id)

        if (storage.user_id !== this.user.id) {
            throw new Error('This storage does not belong to this user')
        }

        try {
            const result = await sequelize.transaction(async (t) => {
                const lot = await Lot.create({ model: model }, { transaction: t })

                await Product.bulkCreate(Array(amount).fill({ lot_number: lot.id, status: 1 /* New product */ }), { transaction: t })

                await WarehouseRecord.create({ storage_id: storage_id, lot_number: lot.id }, { transaction: t })

                return lot.id
            })

            return result

        } catch (err) {
            throw err
        }
    }

    async getProduct() {
        const query = 'SELECT Products.id, Products.status, Products.lot_number, ProductModels.product_line, ProductModels.name as model, Storages.id AS storage_id, Products.createdAt as manufacturing_date FROM Products JOIN Lots ON Products.lot_number = Lots.id JOIN ProductModels ON Lots.model = ProductModels.id JOIN WarehouseRecords ON Lots.id = WarehouseRecords.lot_number JOIN Storages ON WarehouseRecords.storage_id = Storages.id WHERE Products.status in (1, 9) AND Storages.user_id = :user_id UNION SELECT Products.id, Products.status, Products.lot_number, ProductModels.product_line, ProductModels.name as model, Storages.id AS storage_id, Products.createdAt as manufacturing_date FROM Products JOIN Lots ON Products.lot_number = Lots.id JOIN ProductModels ON Lots.model = ProductModels.id JOIN InventoryRecords ON InventoryRecords.products_id = Products.id JOIN Storages ON Storages.id = InventoryRecords.storage_id WHERE Products.status in (1, 9) AND Storages.user_id = :user_id';

        const result = await sequelize.query(query, {
            replacements: { user_id: this.user.id },
            type: QueryTypes.SELECT
        })

        return result
    }
}

module.exports = ProductionFactory