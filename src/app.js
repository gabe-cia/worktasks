(function () {
    'use strict';

    const database = require('./config/database');
    const express = require('express');
    const app = express();

    // parse application/json content-types
    app.use(express.json());

    // declaring middlewares
    const authenticationMiddleware = require("./middleware/authentication");
    app.use(authenticationMiddleware);

    // declaring controllers
    const userController = require('./controller/user-controller');
    const taskController = require('./controller/task-controller');
    app.use("/users", userController);
    app.use("/tasks", taskController);

    // healthcheck
    app.use('/healthcheck', require('express-healthcheck')());

    // generic error handling
    app.use((req, res, next) => {
        const error = new Error("Resource Not Found!");
        error.status = 404;
        next(error);
    });
    app.use((error, req, res, next) => {
        res.status(error.status || 500);
        res.json({
            "error": error.message
        });
    });

    // setting database connection
    module.exports = database.authenticate();

    module.exports = app;
})();
