(function () {
    'use strict';

    const userService = require('../service/user-service');
    const router = require('express').Router();

    /**
     * @openapi
     * 
     * /users/login:
     *  post:
     *    description: Authenticate user so he can use our APIs
     *    tags:
     *      - Users
     *    consumes:
     *      - application/json
     *    produces:
     *      - application/json
     *    parameters:
     *      - in: body
     *        name: Credentials
     *        schema:
     *          $ref: '#/definitions/LoginReq'
     *    responses: 
     *      '200': 
     *        description: A successful response that means that the user is authenticated
     *        schema:
     *          $ref: '#/definitions/LoginResp'
     *      '400':
     *        description: Whenever the request body was invalid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '404':
     *        description: Whenever the user could not be found
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '401':
     *        description: Whenever the credentials were not valid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '500':
     *        description: Whenever some generic error occurs
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     */
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

    /**
     * @openapi
     * 
     * definitions:
     *   LoginReq:
     *     type: object
     *     required:
     *       - username
     *       - password
     *     properties:
     *       username:
     *         type: string
     *         description: User's login name
     *         example: michael.scott
     *       password:
     *         type: string
     *         description: User's password
     *         example: my-password
     *   LoginResp:
     *     type: object
     *     properties:
     *       authorization_token:
     *         type: string
     *         description: Authorization token that should be sent on the request header
     *         example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QzYmE3NjctOWVhNi00NDYxLWIxYjEtNzllODQ1YWVmNjZlIiwidXNlcl9yb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTYzNTA1NzQ3NywiZXhwIjoxNjM1MDYxMDc3fQ.jXjbv8oj_syVUyrMj1GCc_hNrgBgTQnK93AftqItbas
     *       expires_in:
     *         type: string
     *         description: How long this token will take to expire
     *         example: 1h
     *       created_at:
     *         type: number
     *         description: The milliseconds representing the creation date
     *         example: 1635057477525
     *   ErrorResp:
     *      type: object
     *      properties:
     *        error:
     *          type: string
     *          description: Error's description
     *          example: Error description
     */
})();