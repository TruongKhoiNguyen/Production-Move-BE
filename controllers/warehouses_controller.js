const { Warehouse } = require('../models/_index').models

/**
 * Create and save new warehouse to the database
 * @param {Request} req - Must contains location, user_id
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { location, user_id } = req.body

    if (!location || !user_id) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Warehouse.create({ location: location, user_id: user_id })
        .then(result => res.status(201).json({ warehouse: result }))
        .catch(err => res.status(500).json({ error: err, message: 'Can not create new warehouse' }))
}

/**
 * Get all warehouses information from the database
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

    Warehouse.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ warehouses: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}