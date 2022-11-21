const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/User')

const loginCheck = passport => {
    passport.use(
        new LocalStrategy({ usernameField: 'name' }, (name, password, done) => {
            User.find(name).then(user => {
                if (!user) {
                    return done(null, false, { message: 'This user does not exist' })
                }

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
        done(null, user.name)
    })

    passport.deserializeUser((name, done) => {
        User.find(name).then(user => {
            if (!user) {
                done(null, user)
            } else {
                done(null, {})
            }
        })
    })
}

module.exports = { loginCheck }