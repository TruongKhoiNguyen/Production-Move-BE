const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/index').sequelize.models.User

const registerUser = (req, res) => {
    console.log(req.body)
    const { name, password, confirm } = req.body

    if (!name || !password || !confirm) {
        return res.status(400).json({ message: 'Fill empty field' })
    }

    if (password !== confirm) {
        return res.status(400).json({ success: false, message: 'Password must match' })
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
                        User.create({ name: name, password: hash }).then((user) => {
                            res.status(201).json({ data: user, message: 'User created' })
                        })
                    }
                })
            })
        }
    })
}

const loginUser = (req, res) => {
    const { name, password } = req.body

    if (!name || !password) {
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

        const body = { id: user.id, name: user.name }
        const token = jwt.sign(body, 'a')

        res.status(200).json({ user: token, message: 'User authenticated' })
    })(req, res)
}

module.exports = { registerUser, loginUser }