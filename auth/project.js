const jwt = require('jsonwebtoken')

const protectRoute = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }

    res.status(401).json({ message: 'User not authenticated' })
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'No token' })
    }

    jwt.verify(token, 'a', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Unauthorize' })
        }

        req.user = user

        next()
    })
}

module.exports = {
    protectRoute,
    authenticateToken
}