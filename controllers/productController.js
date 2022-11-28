const { Product } = require('../models/index')

const create = (req, res) => {
    const { product_line, model, lot_number, serial_number } = req.body

    if (!product_line || !model || !lot_number || !serial_number) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    Product.create({ product_line: product_line, model: model, lot_number: lot_number, serial_number: serial_number })
        .then(result => res.status(201).json({ product: result }))
        .catch(err => res.status(500).json({ error: err }))
}

const getAll = (req, res) => {
    Product.findAll()
        .then(result => res.status(200).json({ products: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}