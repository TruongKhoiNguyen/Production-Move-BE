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
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = (req, res) => {
    Customer.findAll()
        .then(result => res.status(200).json({ customers: result }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    create,
    getAll
}