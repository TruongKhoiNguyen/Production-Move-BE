const passport = require('passport')
const jwt = require('jsonwebtoken')

const UsersManager = require('../models/users_manager')
const Encryption = require('../models/encryption')
const User = UsersManager.User


/**
 * Register new user to the database
 * @param {Request} req - This request must contain email, name, password, confirm, role
 * @param {Response} res 
 * @returns 
 */
const register = async (req, res) => {
    const { email, name, password, confirm, role } = req.body

    if (!name || !password || !confirm || !email || !role) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    if (role === 'executive') {
        return res.status(400).json({ message: 'This role is can not be registered' })
    }

    if (password !== confirm) {
        return res.status(400).json({ message: 'Password must match' })
    }

    const isDuplicated = await UsersManager.checkDuplicated(email)

    if (isDuplicated) {
        return res.status(400).json({ message: 'User already existed' })
    }

    try {
        const hash = await Encryption.hash(password)

        User.create({ email: email, name: name, password: hash, role: role }).then((user) => {
            res.status(201).json({ data: user, message: 'User created' })
        }).catch(err => {
            res.status(500).json({ error: err, message: 'Can not create user' })
        })

    } catch (err) {
        res.status(500).json({ error: err })
    }

}

/**
 * Take login information and return a token for accessing other routes
 * @param {Request} req - Must contains email, password
 * @param {Response} res 
 * @returns 
 */
const login = (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400).json({ message: 'Empty field' })
        return
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(400).json({ error: err, message: 'Can not authenticate' })
        }

        if (!user) {
            return res.status(400).json({ message: 'This user does not exist' })
        }

        const body = { id: user.id, email: user.email, name: user.name, role: user.role }
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(body, secret)

        res.status(200).json({ token: token, user: body, message: 'User authenticated' })
    })(req, res)
}

/**
 * Get all users in the database
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

    User.findAll({ limit: limit, offset: offset })
        .then(result => result.map((user) => ({ id: user.id, email: user.email, name: user.name, role: user.role })))
        .then(users => res.status(200).json({ users: users }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    register,
    login,
    getAll
}