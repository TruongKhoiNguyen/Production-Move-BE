const ModelsManager = require('../models_manager')
const StateManager = require('../states/state_manager')

const { Logistics, LotLogistics: PersitentLotLogistics } = ModelsManager.models
const sequelize = ModelsManager.connection

class LotLogistic {
    #lot_number

    constructor(lot_number) {
        this.#lot_number = lot_number
    }

    async send(from, to) {
        try {
            const result = await sequelize.transaction(async (t) => {
                const delivery = await Logistics.create({ from: from, to: to, type: 'lot' }, { transaction: t })
                await PersitentLotLogistics.create({ delivery_id: delivery.id, lot_number: this.#lot_number }, { transaction: t })
                StateManager.changeLotState(this.#lot_number, 0 /* Shipping */)
                return delivery.id
            })

            return result
        } catch (err) {
            throw err
        }
    }
}

module.exports = LotLogistic