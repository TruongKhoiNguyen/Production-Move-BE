const { QueryTypes } = require('sequelize')
const ModelsManager = require('../models_manager')

const sequelize = ModelsManager.connection


const normalQuery = 'SELECT Products.id, Products.status, Products.lot_number, ProductModels.product_line, ProductModels.name AS model, Products.createdAt AS manufacturing_date FROM Products JOIN Lots ON Products.lot_number = Lots.id JOIN ProductModels ON Lots.model = ProductModels.id'
const queryWithLimit = normalQuery + ' LIMIT :limit OFFSET :offset'

class ExecutiveBoard {
    static getProduct(limit = null, offset = null) {
        if (limit && (offset || offset === 0)) {
            return (async () => (
                await sequelize.query(queryWithLimit, {
                    replacements: { limit: limit, offset: offset },
                    type: QueryTypes.SELECT
                })
            ))
        }

        return (async () => (
            await sequelize.query(normalQuery, {
                type: QueryTypes.SELECT
            })
        ))
    }
}

module.exports = ExecutiveBoard