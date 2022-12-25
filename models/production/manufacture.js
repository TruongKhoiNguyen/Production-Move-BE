const ModelsManager = require('../models_manager')
const Warehouse = require('../storage/warehouse')

const sequelize = ModelsManager.connection
const { Product, Lot, Storage } = ModelsManager.models

class Manufacture {
    #productionFactory

    constructor(productionFactory) {
        this.#productionFactory = productionFactory
    }

    async execute(model, amount, warehouse_id) {
        const lot_number = await this.#produce(model, amount)
        const id = await this.#store(warehouse_id, lot_number)
        return id
    }

    async #produce(model, amount) {
        try {
            const result = await sequelize.transaction(async (t) => {
                const lot = await Lot.create({ model: model }, { transaction: t })

                for (let i = 0; i < amount; i++) {
                    await Product.create({ lot_number: lot.id, status: 1 /* New product */ }, { transaction: t })
                }

                return lot.id
            })

            return result
        } catch (err) {
            throw err
        }
    }

    async #store(warehouse_id, lot_number) {
        const storage = await Storage.findByPk(warehouse_id)
        const owner = await storage.getUser()

        if (owner.id !== this.#productionFactory.id) {
            throw Error('Warehouse does not belong to this user')
        }

        const warehouse = new Warehouse(storage)
        const id = await warehouse.store(lot_number)

        return id
    }
}

module.exports = Manufacture