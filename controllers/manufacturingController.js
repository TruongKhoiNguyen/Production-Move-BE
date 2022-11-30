const { Manufacturing } = require('../models/index')

const create = (req, res) => {
    const { tracker_id, warehouse_id } = req.body

    if (!tracker_id || !warehouse_id) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Manufacturing.create({ tracker_id: tracker_id, warehouse_id: warehouse_id })
        .then(result => res.status(201).json({ manufacturing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

const getAll = (req, res) => {
    Manufacturing.findAll()
        .then(result => res.status(200).json({ manufacturing: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}