const ModelsManager = require('./models_manager')

const sequelize = ModelsManager.connection
const { Shipping, LotShipping, Product } = ModelsManager.models

class LotShippingManager {
    static async send(from, to, lot_number) {
        try {
            await sequelize.transaction(async (t) => {
                const shipping_id = await this.#createLotShipping(from, to, lot_number, t)
                await this.#updateStatus(lot_number, 0 /* Shipping */, t)

                return shipping_id
            })
        } catch (err) {
            throw err
        }
    }

    static async #createLotShipping(from, to, lot_number, transaction) {
        const shipping = await Shipping.create({ from: from, to: to }, { transaction: transaction })
        await LotShipping.create(
            { next_state: 2, shipping_id: shipping.id, lot_number: lot_number },
            { transaction: transaction }
        )

        return shipping.id
    }

    static async #updateStatus(lot_number, status, transaction) {
        await Product.update(
            { status: status },
            {
                where: { lot_number: lot_number },
                transaction: transaction
            }
        )
    }
}

module.exports = LotShippingManager

