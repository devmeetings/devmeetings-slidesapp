var Q = require('q');
var TaskDataModel = require('../models/task-data');



var TaskData = {

    getOrCreateTaskData: function(slideId, user) {
        return TaskDataModel.findOne({
            slideId: slideId,
            userId: user
        }).exec().then( function (taskData) {
            var result = Q.defer();
            if (taskData) {
                if (!taskData.tasks) {
                    taskData.tasks = [];
                }
                result.resolve(taskData);
                return result.promise;
            }
            TaskDataModel.create({
                slideId: slideId,
                userId: user,
                tasks: []
            }, function (err, taskData) {
                result.resolve(taskData); 
            });

            return result.promise;
        });
    },

    getTaskDataForUsers: function(slideId, users) {
        return TaskDataModel.find({
            slideId: slideId,
            userId: {
                $in : users
            }
        }).exec();
    }
};


module.exports = TaskData;
 
