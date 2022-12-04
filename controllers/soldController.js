const { Sold } = require('../models/index')

/**
 * Add new information about a product that has been sold to a customer
 * @param {Request} req - Must contains tracker_id, customer_id 
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { tracker_id, customer_id } = req.body

    if (!tracker_id || !customer_id) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Sold.create({ tracker_id: tracker_id, customer_id: customer_id })
        .then(result => res.status(201).json({ sold: result }))
        .catch(err => res.status(500).json({ error: err }))
}

/**
 * Get all information about products that have been sold to a customer
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


    Sold.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ sold: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}