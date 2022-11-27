const Warehouse = require('../models/warehouse')

const create = (req, res) => {
    const { location, user_id } = req.body

    if (!location || !user_id) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Warehouse.create({ location: location, user_id: user_id })
        .then(result => res.status(201).json({ warehouse: result }))
        .catch(err => res.status(500).json({ error: err, message: 'Can not create new warehouse' }))
}

const getAll = (req, res) => {
    Warehouse.findAll()
        .then(result => res.status(200).json({ warehouses: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}