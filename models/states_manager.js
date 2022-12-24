const { Product } = require('./models_manager').models

class StatesManager {
    static async onShipping(component) {
        await Product.update({ status: 0 /*Shipping*/ },
            {
                where: {
                    lot_number: component.lotNumber
                }
            }
        )
    }
}

module.exports = StatesManager