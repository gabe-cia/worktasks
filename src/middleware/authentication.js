(function () {
    'use strict';

    const jwt = require("jsonwebtoken");

    const IGNORED_AUTH_ROUTES = ["/users/login"];
    module.exports = (req, res, next) => {
        if (IGNORED_AUTH_ROUTES.indexOf(req.originalUrl) < 0) {
            const token = req.headers["authorization"];
            try {
                if (!token) {
                    let error = new Error("Invalid Authorization token");
                    error.status = 401;
                    return next(error);
                } else {
                    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
                    req.user = decoded;
                }
            } catch (err) {
                let error = new Error("Invalid Authorization token");
                error.status = 401;
                return next(error);
            }
        }
        return next();
    };
})();