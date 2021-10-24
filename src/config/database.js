(function () {
    'use strict';

    const { Sequelize } = require("sequelize");
    const config = require('./config');

    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        {
            dialect: config.dialect,
            port: config.port,
            define: {
                timestamps: false
            },
            logging: config.logging
        },
        config.define
    );

    module.exports = sequelize;
})();