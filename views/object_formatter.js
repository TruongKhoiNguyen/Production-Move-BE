class ObjectFormatter {
    static omitProperty(keys, object) {
        if (keys.length === 0) {
            return object
        }

        const { [keys[keys.length - 1]]: omitted, ...rest } = object

        return this.omitProperty(keys.slice(0, keys.length - 1), rest)
    }
}

module.exports = ObjectFormatter