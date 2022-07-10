'use strict';

module.exports = function(app) {
    var todoList = require('../controllers/todoListController');

    app.route('/tasks')
        .get(todoList.listAllTasks)
        .post(todoList.createTask);

    app.route('/task/:taskId')
        .get(todoList.readTask)
        .put(todoList.updateTask)
        .delete(todoList.deleteTask);
};
