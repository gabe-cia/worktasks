(function () {
    'use strict';

    const userService = require('../service/user-service');
    const router = require('express').Router();

    router.post('/login', async (req, res, next) => {
        try {
            let { username, password } = req.body;
            if (isAuthenticationBodyValid(username, password)) {
                res.json(await userService.authenticate(username, password));
            } else {
                res.status(400).json({
                    "message": "The 'username' and 'password' properties are mandatory"
                });
            }
        } catch (error) {
            next(error);
        }
    });

    function isAuthenticationBodyValid(username, password) {
        return username && password;
    }

    module.exports = router;
})();