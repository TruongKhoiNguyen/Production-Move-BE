const bcrypt = require('bcryptjs')

class Encryption {
    static hash(str) {
        return new Promise(resolve => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(str, salt, (err, hash) => {
                    if (err) {
                        throw err
                    } else {
                        resolve(hash)
                    }
                })
            })
        })
    }
}

module.exports = Encryption