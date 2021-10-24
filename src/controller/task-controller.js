(function () {
    'use strict';

    const userService = require('../service/task-service');
    const router = require('express').Router();

    router.get('/', async (req, res, next) => {
        try {
            res.json(await userService.getAllTasks(req.user));
        } catch (error) {
            next(error);
        }
    });

    router.get('/:id', async (req, res, next) => {
        try {
            res.json(await userService.getTaskById(req.user, req.params.id));
        } catch (error) {
            next(error);
        }
    });

    router.post('/', async (req, res, next) => {
        try {
            if (_isTaskBodyValid(req.body)) {
                let taskId = await userService.createTask(req.user, req.body);
                res.header("Location", "/tasks/" + taskId)
                    .status(201).end();
            } else {
                res.status(400).json({
                    "message": "The 'summary' property is mandatory"
                });
            }
        } catch (error) {
            next(error);
        }
    });

    router.put('/:id', async (req, res, next) => {
        try {
            if (_isUpdateTaskBodyValid(req.body)) {
                req.body.id = req.params.id;
                await userService.updateTask(req.user, req.body);
                res.status(204).end();
            } else {
                res.status(400).json({
                    "message": "The 'summary' and 'status' properties are mandatory"
                });
            }
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:id', async (req, res, next) => {
        try {
            await userService.deleteTask(req.user, req.params.id);
            res.status(204).end();
        } catch (error) {
            next(error);
        }
    });

    function _isTaskBodyValid(body) {
        return body && body.summary;
    }

    function _isUpdateTaskBodyValid(body) {
        return body && body.summary && body.status;
    }

    module.exports = router;
})();