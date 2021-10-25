(function () {
	'use strict';

    // setting the environment variables configuration
    require('dotenv').config();

    let { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, DB_DIALECT } = process.env;
	module.exports = {
		"username": DB_USER,
		"password": DB_PASSWORD,
		"database": DB_NAME,
		"host": DB_HOST,
        "port": DB_PORT,
		"dialect": DB_DIALECT,
		"operatorsAliases": false,
		"logging":false
	}
})();