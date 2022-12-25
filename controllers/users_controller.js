const passport = require('passport')
const jwt = require('jsonwebtoken')

const UsersManager = require('../models/users_manager')
const Encryption = require('../models/encryption')
const Response = require('../views/response')
const ControllerUtil = require('./controller_utils')
const User = UsersManager.User


/**
 * Register new user to the database
 * @param {Request} req - This request must contain email, name, password, confirm, role
 * @param {Response} res 
 * @returns 
 */
const register = async (req, res) => {
    const { email, name, password, role } = req.body

    if (ControllerUtil.checkEmptyFields(email, name, password, role)) {
        return Response.badRequest(res, 'Fill empty field')
    }

    if (role === 'executive') {
        return Response.badRequest(res, 'This role is can not be registered')
    }

    const isDuplicated = await UsersManager.checkDuplicated(email)

    if (isDuplicated) {
        return Response.badRequest(res, 'User already existed')
    }

    try {
        const hash = await Encryption.hash(password)

        User.create({ email: email, name: name, password: hash, role: role }).then((user) => {
            Response.created(res, { message: 'User created' })
        }).catch(err => {
            Response.internalServerError(res, err.message)
        })

    } catch (err) {
        Response.internalServerError(res, err.message)
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

    if (ControllerUtil.checkEmptyFields(email, password)) {
        return Response.badRequest(res, 'Fill empty field')
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return Response.badRequest(res, err.message)
        }

        if (!user) {
            return Response.badRequest(res, 'This user does not exist')
        }

        const body = { id: user.id, role: user.role }
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(body, secret)

        Response.ok(res, { token: token, user: { id: user.id, email: user.email, name: user.name } })
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
        .then(users => Response.ok(res, { data: users }))
        .catch(err => Response.internalServerError(res, err))
}

module.exports = {
    register,
    login,
    getAll
}