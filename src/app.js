(function () {
    'use strict';

    const database = require('./config/database');
    const express = require('express');
    const app = express();
    const swaggerJs = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');
    const authenticationMiddleware = require("./middleware/authentication");
    const userController = require('./controller/user-controller');
    const taskController = require('./controller/task-controller');

    // parse application/json content-types
    app.use(express.json());

    // healthcheck
    app.use('/healthcheck', require('express-healthcheck')());

    // swagger documentation
    app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerJs({
        swaggerDefinition: {
            info: {
                title: 'Worktasks API',
                description: 'Worktasks API Challenge',
                contact: {
                    name: 'gabriel.nascimento'
                },
                servers: ['https://localhost:8000'],
                version: '1.0.0'
            }
        },
        apis: ['./src/controller/*.js']
    })));

    // declaring middlewares
    app.use(authenticationMiddleware);

    // declaring controllers
    app.use("/users", userController);
    app.use("/tasks", taskController);

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
