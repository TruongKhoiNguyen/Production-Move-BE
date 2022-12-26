const ModelsManager = require('../models_manager')
const Warehouse = require('../storage/warehouse')
const LotLogistic = require('./lot_logistics')

const { User, Storage } = ModelsManager.models

class ProductionLogistics {
    #productionFactory

    constructor(productionFactory) {
        this.#productionFactory = productionFactory
    }

    async send(id, to) {
        const receiver = await User.findByPk(to)

        if (receiver.role !== 'distribution') {
            throw new Error('Factory can not send to this role')
        }

        const storages = await Storage.findAll({ where: { user_id: this.#productionFactory.id } })

        let isLotExists = false
        for (let i = 0; i < storages.length; i++) {
            const warehouse = new Warehouse(storages[i])
            const lot = await warehouse.retrieve(id)
            if (lot) {
                isLotExists = true
            }
        }

        if (!isLotExists) {
            throw new Error(`There are no lot with lot id ${id} in warehouses`)
        }

        const lotLogistic = new LotLogistic(id)

        const result = await lotLogistic.send(this.#productionFactory.id, to)

        return result
    }
}

module.exports = ProductionLogistics