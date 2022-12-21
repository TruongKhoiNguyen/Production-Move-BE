const passport = require('passport')
const jwt = require('jsonwebtoken')

const UsersManager = require('../models/users_manager')
const Encryption = require('../models/encryption')
const Response = require('../views/response')
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
        return Response.badRequest(res, 'Fill empty field')
    }

    if (role === 'executive') {
        return Response.badRequest(res, 'This role is can not be registered')
    }

    if (password !== confirm) {
        return Response.badRequest(res, 'Password must match')
    }

    const isDuplicated = await UsersManager.checkDuplicated(email)

    if (isDuplicated) {
        return Response.badRequest(res, 'User already existed')
    }

    try {
        const hash = await Encryption.hash(password)

        User.create({ email: email, name: name, password: hash, role: role }).then((user) => {
            Response.created(res, { data: user, message: 'User created' })
        }).catch(err => {
            Response.internalServerError(res, err)
        })

    } catch (err) {
        Response.internalServerError(res, err)
    }

}

/**
 * Take login information and return a token for accessing other routes
 * @param {Request} req - Must contains email, password
 * @param {Response} res 
 * @returns 
 */
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return Response.badRequest(res, 'Fill empty field')
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return Response.badRequest(res, err)
        }

        if (!user) {
            return Response.badRequest(res, 'This user does not exist')
        }

        const body = { id: user.id, email: user.email, name: user.name, role: user.role }
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(body, secret)

        Response.ok(res, { token: token, user: body, message: 'User authenticated' })
    })(req, res)
}

/**
 * Get all users in the database
 * Add limit param to limit the number of result (default 10)
 * Add page param to change page (default 1)
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = async (req, res) => {
    let limit = 10
    let offset = 0

    try {
        limit = parseInt(req.query.limit) || limit
        offset = (parseInt(req.query.page) - 1) * limit || offset
    } catch (err) {
        return Response.badRequest(res, err)
    }

    User.findAll({ limit: limit, offset: offset })
        .then(result => result.map((user) => ({ id: user.id, email: user.email, name: user.name, role: user.role })))
        .then(users => Response.ok(res, { users: users }))
        .catch(err => Response.internalServerError(res, err))
}

module.exports = {
    register,
    login,
    getAll
}