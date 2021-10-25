(function () {
    'use strict';

    const MANAGER_ROLE = "Manager";
    const DONE_TASK_STATUS = "Done";
    const WIP_TASK_STATUS = "WIP";

    const model = require("../models");
    const userService = require("./user-service");
    const messageService = require("./message-service");

    let getAllTasks = async (user_scope, page_scope) => {
        // in case the user was a Manager, we should return all of the tasks
        // otherwise we should return only the task's that belongs to this user
        if (user_scope.user_role === MANAGER_ROLE) {
            return _findAllTasks(page_scope);
        } else {
            return _findTasksByUserId(user_scope.user_id, page_scope);
        }
    };

    let getTaskById = async (user_scope, id) => {
        let task = await _findTasksById(id);

        _validateTask(task);
        _validateGetTaskPermission(user_scope, task);

        return task;
    };

    let createTask = async (user_scope, task) => {
        // adding some more task information before creating it
        task.status = "Waiting";
        task.created_at = _dbDate(new Date());
        task.user_id = task.user_id || user_scope.user_id;

        // getting the user to check if its valid
        // and checking if everything is valid
        await userService.getUserById(task.user_id);
        _validateCreateUpdateTask(user_scope, task);

        // create the user and return its new identifier
        const createdTask = await model.sequelize.models.Task.create(task);
        return createdTask.dataValues.id;
    };

    let updateTask = async (user_scope, task) => {
        let now = _dbDate(new Date());
        let savedTask = await _findTasksById(task.id);

        _validateTask(savedTask);

        // adding properties to task object to be updated
        task.updated_at = now;
        task.created_at = savedTask.dataValues.created_at;
        task.user_id = savedTask.dataValues.user.id;
        if (savedTask.dataValues.status !== task.status) {
            if (task.status === WIP_TASK_STATUS) {
                _notifyManagers(task);
            }
            if (task.status === DONE_TASK_STATUS) {
                task.end_at = now;
            }
        }

        // checking if the task is valid before updating
        _validateCreateUpdateTask(user_scope, task);

        // updating the task
        return await model.sequelize.models.Task.update(task, {
            where: {
                id: task.id
            }
        });
    };

    let deleteTask = async (user_scope, id) => {
        var task = await _findTasksById(id);

        _validateTask(task);
        _validateDeleteTaskPermission(user_scope);

        return model.sequelize.models.Task.destroy({
            where: {
                id: id
            }
        });
    };

    async function _findAllTasks(page_scope) {
        return model.sequelize.models.Task.findAll({
            include: {
                association: "user",
                attributes: {
                    exclude: ['password']
                }
            },
            attributes: {
                exclude: ['user_id']
            },
            limit: page_scope.page_size,
            offset: page_scope.page_size * (page_scope.page - 1)
        });
    }

    async function _findTasksByUserId(user_id, page_scope) {
        return model.sequelize.models.Task.findAll({
            where: {
                user_id: user_id
            },
            include: {
                association: "user",
                attributes: {
                    exclude: ['password']
                }
            },
            attributes: {
                exclude: ['user_id']
            },
            limit: page_scope.page_size,
            offset: page_scope.page_size * (page_scope.page - 1)
        });
    }

    async function _findTasksById(id) {
        return model.sequelize.models.Task.findOne({
            where: {
                id: id,
            },
            include: {
                association: "user",
                attributes: {
                    exclude: ['password']
                }
            },
            attributes: {
                exclude: ['user_id']
            }
        });
    }

    async function _notifyManagers(task) {
        let managers = await userService.getManagers();
        let owner = await userService.getUserById(task.user_id);

        managers.forEach((manager) => {
            messageService.send(process.env.MQ_EMAIL_QUEUE, {
                mail_to: manager.email,
                message: `Dear Ms/Mr. ${manager.name}. The tech ${owner.name} performed the task ${task.id} on date ${task.updated_at}`
            });
        });
    }

    function _dbDate(date) {
        return new Date().toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '');
    }

    function _validateTask(task) {
        if (!task) {
            let error = new Error("Task not found");
            error.status = 404;
            throw error;
        }
    }

    function _validateGetTaskPermission(user_scope, task) {
        if (user_scope.user_role !== MANAGER_ROLE) {
            if (task.user.id !== user_scope.user_id) {
                let error = new Error("Access denied for this user");
                error.status = 403;
                throw error;
            }
        }
    }

    function _validateDeleteTaskPermission(user_scope) {
        if (user_scope.user_role !== MANAGER_ROLE) {
            let error = new Error("Access denied for this user");
            error.status = 403;
            throw error;
        }
    }

    function _validateCreateUpdateTask(user_scope, task) {
        if (user_scope.user_role !== MANAGER_ROLE) {
            if (task.user_id !== user_scope.user_id) {
                let error = new Error("This user cannot create or update tasks from another user");
                error.status = 403;
                throw error;
            }
        }
    }

    module.exports = {
        getAllTasks,
        getTaskById,
        createTask,
        updateTask,
        deleteTask
    };
})();