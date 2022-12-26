const ModelsManager = require('../models_manager')

const sequelize = ModelsManager.connection
const { Product } = ModelsManager.models

class StateManager {
    static async changeLotState(lot_number, state) {
        try {
            await sequelize.transaction(async (t) => {
                await Product.update({ status: state }, { where: { lot_number: lot_number }, transaction: t })
            })

            return true
        } catch (err) {
            return false
        }
    }
}

module.exports = StateManager