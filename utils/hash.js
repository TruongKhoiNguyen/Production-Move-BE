const bcrypt = require('bcryptjs')

const hashPassword = (password) => new Promise(resolve => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                resolve('problem occured when hashing')
            } else {
                resolve(hash)
            }
        })
    })
})

module.exports = {
    hashPassword
}