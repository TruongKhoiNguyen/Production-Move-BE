const { Product } = require('../models/_index').models

/**
 * Add new product to the database
 * @param {Request} req - Must contains product_line, model, lot_number, serial_number 
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { product_line, model, lot_number, serial_number } = req.body

    if (!product_line || !model || !lot_number || !serial_number) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    Product.create({ product_line: product_line, model: model, lot_number: lot_number, serial_number: serial_number })
        .then(result => res.status(201).json({ product: result }))
        .catch(err => res.status(500).json({ error: err }))
}

/**
 * Get all basic information about products
 * 
 * Add limit param to limit the number of result (default 10)
 * Add page param to change page (default 1)
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = (req, res) => {
    let limit = 10
    let offset = 0

    try {
        limit = parseInt(req.query.limit) || limit
        offset = (parseInt(req.query.page) - 1) * limit || offset
    } catch (err) {
        return res.status(400).json({ error: err })
    }


    Product.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ products: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}