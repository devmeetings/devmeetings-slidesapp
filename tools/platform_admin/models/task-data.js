var mongoose = require('mongoose');
Schema = mongoose.Schema;

var TaskData = new Schema({
    slideId: Schema.ObjectId,
    userId: String,
    tasks: [Schema.Types.Mixed]
});

TaskData.virtual('date')
    .get(function () {
        return this._id.getTimestamp();
    });

module.exports = mongoose.model('TaskData', TaskData);

