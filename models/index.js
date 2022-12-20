const ModelsManager = require('../utils/models_manager')

const modelsManager = new ModelsManager()

modelsManager.register('Customer', require('./customer'))
modelsManager.register('Defect', require('./defect'))
modelsManager.register('Distributing', require('./distributing'))
modelsManager.register('Manufacturing', require('./manufacturing'))
modelsManager.register('Product', require('./product'))
modelsManager.register('Repairing', require('./repairing'))
modelsManager.register('Sold', require('./sold'))
modelsManager.register('Tracker', require('./tracker'))
modelsManager.register('User', require('./user'))
modelsManager.register('Warehouse', require('./warehouse'))
modelsManager.register('Request', require('./request'))

modelsManager.setup()

module.exports = modelsManager