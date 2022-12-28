const { QueryTypes, QueryError } = require('sequelize')

const ModelsManager = require('../models/models_manager')
const FormattedResponse = require('../views/response')

const { Lot, ProductModel } = ModelsManager.models
const sequelize = ModelsManager.connection

const get = async (req, res) => {
    const { lot_number } = req.params

    try {
        const query = 'SELECT Lots.id, ProductModels.product_line, ProductModels.name AS model, count(Products.id) AS amount, Lots.createdAt as manufacturing_date FROM Lots JOIN Products ON Products.lot_number = Lots.id JOIN ProductModels ON Lots.model = ProductModels.id WHERE Lots.id = :lot_number GROUP BY Lots.id'
        const result = await sequelize.query(query, {
            replacements: { lot_number: parseInt(lot_number) },
            type: QueryTypes.SELECT
        })
        return FormattedResponse.ok(res, { data: result })

    } catch (err) {
        return FormattedResponse.internalServerError(res, err.message)
    }
}

module.exports = {
    get
}