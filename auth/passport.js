const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/index').sequelize.models.User

const loginCheck = passport => {
    passport.use(
        new LocalStrategy({ usernameField: 'name' }, (name, password, done) => {
            User.findAll({ where: { name: name } }).then(result => {
                if (result.length === 0) {
                    return done(null, false, { message: 'This user does not exist' })
                }

                const user = result[0]

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        return done(err)
                    }

                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Wrong password' })
                    }
                })
            })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findAll({ where: { id: id } }).then(result => {
            if (result.length > 0) {
                done(null, result[0])
            } else {
                done(null, {})
            }
        })
    })
}

module.exports = { loginCheck }