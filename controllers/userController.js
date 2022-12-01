const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const User = require('../models/index').User


const register = (req, res) => {
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

    User.checkDuplicated(name).then((isDuplicated) => {
        if (isDuplicated) {
            res.status(400).json({ message: 'User already existed' })
        } else {
            // hashing password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) {
                        res.status(500).json({ error: err })
                    } else {
                        User.create({ email: email, name: name, password: hash, role: role }).then((user) => {
                            res.status(201).json({ data: user, message: 'User created' })
                        }).catch(err => {
                            res.status(500).json({ error: err, message: 'Can not create user' })
                        })
                    }
                })
            })
        }
    })
}

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
            return res.status(400).json({ message: 'Wrong user name' })
        }

        const body = { id: user.id, email: user.email, name: user.name, role: user.role }
        const secret = process.env.JWT_SECRET
        const token = jwt.sign(body, secret)

        res.status(200).json({ user: token, message: 'User authenticated' })
    })(req, res)
}

const getAll = (req, res) => {
    User.findAll()
        .then(result => result.map((user) => ({ id: user.id, email: user.email, name: user.name, role: user.role })))
        .then(users => res.status(200).json({ users: users }))
        .catch(err => res.status(500).json({ error: err }))
}

module.exports = {
    register,
    login,
    getAll
}