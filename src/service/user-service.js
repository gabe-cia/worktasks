(function () {
    'use strict';

    const MANAGER_ROLE = "Manager";

    const crypto = require("crypto");
    const jwt = require("jsonwebtoken");
    const model = require("../models");

    let authenticate = async (username, password) => {
        let user = await _findUserByName(username);
        _validateUser(user);

        if (_isPasswordValid(user.password, password)) {
            return {
                "authorization_token": _createJwtToken(user),
                "expires_in": process.env.TOKEN_EXPIRATION_TIME,
                "created_at": Date.now()
            };
        } else {
            let error = new Error("Invalid user credentials");
            error.status = 401;
            throw error;
        }
    };

    let getUserById = async (id) => {
        let user = await _findUserById(id);

        _validateUser(user);

        return user;
    };

    let getManagers = async () => {
        return model.sequelize.models.User.findAll({
            where: {
                role: MANAGER_ROLE
              }
        });
    };

    async function _findUserByName(username) {
        return await model.sequelize.models.User.findOne({
            where: {
                username: username
              }
        });
    };

    async function _findUserById(id) {
        return await model.sequelize.models.User.findOne({
            where: {
                id: id
              }
        });
    };


    function _createJwtToken(user) {
        return jwt.sign({ user_id: user.id, user_role: user.role },
            process.env.TOKEN_KEY,
            { expiresIn: process.env.TOKEN_EXPIRATION_TIME }
        );
    }

    function _isPasswordValid(userPassword, sentPassword) {
        const hashPassword = crypto.createHash(process.env.PASSWORD_HASH_ALGORITHM, process.env.PASSWORD_SECRET)
            .update(sentPassword)
            .digest(process.env.PASSWORD_ENCODING);
        return hashPassword === userPassword;
    }

    function _validateUser(user) {
        if (!user) {
            let error = new Error("User not found");
            error.status = 404;
            throw error;
        }
    }

    module.exports = {
        authenticate,
        getUserById,
        getManagers
    };
})();