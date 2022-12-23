const jwt = require('jsonwebtoken')
const { Request, Response } = require('express')
const FormattedResponse = require('../views/response')

const protectRoute = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.status(401).json({ message: 'User not authenticated' })
}

/**
 * Extract login token from request and authenticate user
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 * @returns 
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return FormattedResponse.unauthorized(res, 'No token')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return FormattedResponse.forbidden(res, err.message)
        }

        req.user = user

        next()
    })
}

/**
 * Create a middleware to authorize user
 * @param {Array.<String>} roles - An array of string contains the role that can pass 
 * @returns a middleware that check user permission to access a certain path
 */
const checkRole = (roles) => (async (req, res, next) => {
    const userRole = req.user.role

    if (!userRole) {
        return FormattedResponse.badRequest(res, 'Can not find role in request')
    }

    if (roles.includes(userRole)) {
        next()
    } else {
        return FormattedResponse.forbidden(res, 'Can not access this route')
    }
})

/**
 * Combine authentication and authorization
 * @param {Array.<String>} roles - An array of string contains the role that can pass  
 * @returns {Array.<Function>} An array contain middleware for both authentication and authorization
 */
const createAuthorizer = (roles) => [authenticateToken, checkRole(roles)]

module.exports = {
    protectRoute,
    authenticateToken,
    checkRole,
    createAuthorizer
}