const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { PointCardSchema } = require('./PointCard');

/**
 * User Activity History Schema, save user attend history and their point card
 * @child PointCard
 *
 * @param uid: Line user ID
 * @param activity: array of activity history
 * - @param name: activity name
 * - @param startDatetime: activity start time
 * - @param endDatetime: activity end time
 * - @param pointcard: PointCardSchema, attend record of activity
 */

const UserActivityHistorySchema = new Schema({
    uid: { type: String, required: true },
    activity: [
        {
            name: { type: String, required: true },
            startDatetime: { type: Date, require: true},
            endDatetime: {type: Date, require: true},
            pointcard: { type: PointCardSchema, required: false }
        }
    ],
});
const UserActivityHistory = mongoose.model('UserActivityHistory', UserActivityHistorySchema);

module.exports = {
    UserActivityHistory
};