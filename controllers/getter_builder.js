const ControllerUtil = require('./controller_utils')
const FormattedResponse = require('../views/response')

class GetterBuilder {
    #setVar = (req, vars) => { }
    #model
    #setCondition = (vars) => ({})
    #resultFormatter = (instance) => instance

    static of() {
        return new GetterBuilder()
    }

    setVariables(callback) {
        this.#setVar = callback
        return this
    }

    setCondition(model, condition = this.#setCondition) {
        this.#model = model
        this.#setCondition = condition
        return this
    }

    setResultFormatter(formatter) {
        this.#resultFormatter = formatter
        return this
    }

    build() {
        return (async (req, res) => {
            let vars = {}
            this.#setVar(req, vars)
            const { limit, offset } = ControllerUtil.pagination(req)

            try {
                const result = await this.#model.findAll({ where: this.#setCondition(vars), limit: limit, offset: offset })
                return FormattedResponse.ok(res, { data: result.map(this.#resultFormatter) })
            } catch (err) {
                return FormattedResponse.internalServerError(res, err.message)
            }

        })
    }
}

module.exports = GetterBuilder