const { DataTypes } = require('sequelize')
const sequelize = require('../database/models').sequelize

const Tracker = sequelize.define('Tracker', {
    product_id: DataTypes.INTEGER,
    status: {
        type: DataTypes.INTEGER,
        validate: {
            max: 12,
            min: 1
        },
        comment: `
        Meaning of Status number:
        1: Product is just manufactured and stored in the factory warehouse
        2: Product has been send to distribution center
        3: Product has been sold to a customer
        4: Product has some problem and need to be repaired, distribution agent is currently having this product
        5: Product is being repaired
        6: Product has already been repaired and now in distribution agent inventory
        7: Product can not be repaired and has been sent back from warranty center to distribution agent
        8: Product can not be repaired and has been sent back to production factory
        9: Product need to be recalled
        10: Product warranty expired
        11: Product is being sent back to factory due to unsatisfactory sales
        12: Shipping
        `
    }
}, {
    tableName: 'trackers'
})

Tracker.setup = (models) => {
    Tracker.hasOne(models.Manufacturing, { foreignKey: 'tracker_id' })
    Tracker.hasOne(models.Distributing, { foreignKey: 'tracker_id' })
    Tracker.hasOne(models.Sold, { foreignKey: 'tracker_id' })
    Tracker.hasOne(models.Repairing, { foreignKey: 'tracker_id' })
    Tracker.hasOne(models.Defect, { foreignKey: 'tracker_id' })
}

module.exports = Tracker