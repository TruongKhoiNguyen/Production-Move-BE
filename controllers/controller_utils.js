class ControllerUtil {
    static checkEmptyFields(...fields) {
        return fields.reduce((field1, field2) => !field1 || !field2, false)
    }
}

module.exports = ControllerUtil