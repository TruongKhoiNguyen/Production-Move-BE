class ControllerUtil {
    static checkEmptyFields(...fields) {
        let result = false
        for (let field in fields) {
            result = result || !field
        }

        return result
    }
}

module.exports = ControllerUtil