const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Point Card Schema, attend record for activity.
 * @param uid: Line user ID
 * @param activity: related activity mongo ObjectID
 * @param cardField: dynamic field for record
 * - @param name: field name
 * - @param type: value type, must be 'Bool', 'Int' or 'String'
 * - @param value: dynamic type of value for this field
 */
const PointCardSchema = new Schema({
    status: { type: Number, default: 0 },
    cardField: [
        {
            name: { type: String, required: true },
            type: { type: String, required: true, enum: ['Bool', 'Int', 'String'] },
            value: { type: Schema.Types.Mixed, required: true }
        }
    ]
});

module.exports = {
    PointCardSchema
};