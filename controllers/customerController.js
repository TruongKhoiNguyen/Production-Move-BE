const Customer = require('../models/index').Customer

/**
 * Register new customer to the database
 * @param {Request} req - Must contain name, email, phone_number
 * @param {Response} res 
 * @returns 
 */
const create = (req, res) => {
    const { name, email, phone_number } = req.body

    if (!name || !email || !phone_number) {
        return res.status(400).json({ message: 'Fill emtpy field' })
    }

    Customer.create({ name: name, email: email, phone_number: phone_number })
        .then(result => res.status(201).json({ customer: result }))
        .catch(err => res.status(500).json({ error: err }))
}

/**
 * Get all customers data from the database
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

    Customer.findAll({ limit: limit, offset: offset })
        .then(result => res.status(200).json({ customers: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}