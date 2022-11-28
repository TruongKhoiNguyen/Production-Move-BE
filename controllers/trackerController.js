const { Tracker } = require('../models/index')

const create = (req, res) => {
    const { product_id, status } = req.body

    if (!product_id || !status) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    Tracker.create({ product_id: product_id, status: status })
        .then(result => res.status(201).json({ tracker: result }))
        .catch(err => res.status(500).json({ error: err }))
}

const getAll = (req, res) => {
    Tracker.findAll()
        .then(result => res.status(200).json({ trackers: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}