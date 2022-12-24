const { User } = require('./models_manager').models

class StatesManager {
    static async onShipping(component) {
        await User.update({ status: 0 /*Shipping*/ },
            {
                where: {
                    lot_number: component.lotNumber
                }
            })
    }
}

module.exports = StatesManager