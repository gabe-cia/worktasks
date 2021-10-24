(function () {
    'use strict';

    const userService = require('../service/task-service');
    const router = require('express').Router();

    /**
     * @openapi
     * 
     * /tasks:
     *  get:
     *    description: List all the tasks. In case the user was a Manager, it should bring all registered tasks. Otherwise, it will bring only the tasks he owns.
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - in: header
     *        name: Authorization
     *        type: string
     *        format: jwt
     *        x-example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QzYmE3NjctOWVhNi00NDYxLWIxYjEtNzllODQ1YWVmNjZlIiwidXNlcl9yb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTYzNTA1NzQ3NywiZXhwIjoxNjM1MDYxMDc3fQ.jXjbv8oj_syVUyrMj1GCc_hNrgBgTQnK93AftqItbas
     *    responses: 
     *      '200': 
     *        description: A list with tasks
     *        schema:
     *          $ref: '#/definitions/TaskListResp'
     *      '401':
     *        description: Whenever the credentials were not valid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '500':
     *        description: Whenever some generic error occurs
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     */
    router.get('/', async (req, res, next) => {
        try {
            res.json(await userService.getAllTasks(req.user));
        } catch (error) {
            next(error);
        }
    });

    /**
     * @openapi
     * 
     * /tasks/{id}:
     *  get:
     *    description: Get a task by its identifier. It only brings tasks that are own by the user unless the user was a Manager
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - in: header
     *        name: Authorization
     *        type: string
     *        format: jwt
     *        x-example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QzYmE3NjctOWVhNi00NDYxLWIxYjEtNzllODQ1YWVmNjZlIiwidXNlcl9yb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTYzNTA1NzQ3NywiZXhwIjoxNjM1MDYxMDc3fQ.jXjbv8oj_syVUyrMj1GCc_hNrgBgTQnK93AftqItbas
     *      - in: path
     *        name: id
     *        type: string
     *        description: The task's identifier
     *    responses: 
     *      '200': 
     *        description: The task with the given identifier
     *        schema:
     *          $ref: '#/definitions/TaskResp'
     *      '404':
     *        description: Whenever the task could not be found
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '401':
     *        description: Whenever the credentials were not valid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '403':
     *        description: Whenever the user is trying to access a task that doesn't belong to him
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '500':
     *        description: Whenever some generic error occurs
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     */
    router.get('/:id', async (req, res, next) => {
        try {
            res.json(await userService.getTaskById(req.user, req.params.id));
        } catch (error) {
            next(error);
        }
    });

    /**
     * @openapi
     * 
     * /tasks:
     *  post:
     *    description: Create a new task
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    consumes:
     *      - application/json
     *    parameters:
     *      - in: header
     *        name: Authorization
     *        type: string
     *        format: jwt
     *        x-example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QzYmE3NjctOWVhNi00NDYxLWIxYjEtNzllODQ1YWVmNjZlIiwidXNlcl9yb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTYzNTA1NzQ3NywiZXhwIjoxNjM1MDYxMDc3fQ.jXjbv8oj_syVUyrMj1GCc_hNrgBgTQnK93AftqItbas
     *      - in: body
     *        name: Task
     *        schema:
     *          $ref: '#/definitions/CreateTaskReq'
     *    responses: 
     *      '201': 
     *        description: A success response. This response carries the location of the created task within the header 'Location'.
     *      '400':
     *        description: Whenever the request body was invalid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '404':
     *        description: Whenever the task could not be found
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '401':
     *        description: Whenever the credentials were not valid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '403':
     *        description: Whenever the user is trying to access a task that doesn't belong to him
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '500':
     *        description: Whenever some generic error occurs
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     */
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

    /**
     * @openapi
     * 
     * /tasks/{id}:
     *  put:
     *    description: Update a given task
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    consumes:
     *      - application/json
     *    parameters:
     *      - in: header
     *        name: Authorization
     *        type: string
     *        format: jwt
     *        x-example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QzYmE3NjctOWVhNi00NDYxLWIxYjEtNzllODQ1YWVmNjZlIiwidXNlcl9yb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTYzNTA1NzQ3NywiZXhwIjoxNjM1MDYxMDc3fQ.jXjbv8oj_syVUyrMj1GCc_hNrgBgTQnK93AftqItbas
     *      - in: body
     *        name: Task
     *        schema:
     *          $ref: '#/definitions/UpdateTaskReq'
     *      - in: path
     *        name: id
     *        type: string
     *        description: The task's identifier
     *    responses: 
     *      '204': 
     *        description: A successful response
     *      '400':
     *        description: Whenever the request body was invalid
     *      '404':
     *        description: Whenever the task could not be found
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '401':
     *        description: Whenever the credentials were not valid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '403':
     *        description: Whenever the user is trying to update a task that doesn't belong to him
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '500':
     *        description: Whenever some generic error occurs
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     */
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

    /**
     * @openapi
     * 
     * /tasks/{id}:
     *  delete:
     *    description: Delete a task by its identifier. Only manager can delete tasks
     *    tags:
     *      - Tasks
     *    produces:
     *      - application/json
     *    parameters:
     *      - in: header
     *        name: Authorization
     *        type: string
     *        format: jwt
     *        x-example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2QzYmE3NjctOWVhNi00NDYxLWIxYjEtNzllODQ1YWVmNjZlIiwidXNlcl9yb2xlIjoiVGVjaG5pY2lhbiIsImlhdCI6MTYzNTA1NzQ3NywiZXhwIjoxNjM1MDYxMDc3fQ.jXjbv8oj_syVUyrMj1GCc_hNrgBgTQnK93AftqItbas
     *      - in: path
     *        name: id
     *        type: string
     *        description: The task's identifier
     *    responses: 
     *      '204': 
     *        description: A successful response
     *      '404':
     *        description: Whenever the task could not be found
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '401':
     *        description: Whenever the credentials were not valid
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '403':
     *        description: Whenever the user is trying to access a task that doesn't belong to him
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     *      '500':
     *        description: Whenever some generic error occurs
     *        schema:
     *          $ref: '#/definitions/ErrorResp'
     */
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

    /**
     * @openapi
     * 
     * definitions:
     *   TaskListResp:
     *     type: array
     *     items:
     *       $ref: '#/definitions/TaskResp'
     *   TaskResp:
     *     type: object
     *     properties:
     *       id:
     *         type: string
     *         format: uuid
     *         description: Task's identifier
     *         example: 0d58680f-7c8b-4de5-a80d-1e53cb1c60ce
     *       summary:
     *         type: string
     *         description: Task's summary
     *         example: My task 123 456
     *       status:
     *         type: string
     *         enum: [Waiting, WIP, Done]
     *         description: Task's status
     *         example: WIP
     *       created_at:
     *         type: string
     *         format: date
     *         pattern: 'yyyy-MM-dd HH:mm:ss'
     *         description: Task's creation date
     *         example: 2020-03-04 10:20:30
     *       updated_at:
     *         type: string
     *         format: date
     *         pattern: 'yyyy-MM-dd HH:mm:ss'
     *         description: Task's update date
     *         example: 2020-03-04 10:20:30
     *       end_at:
     *         type: string
     *         format: date
     *         pattern: 'yyyy-MM-dd HH:mm:ss'
     *         description: Task's done date
     *         example: 2020-03-04 10:20:30
     *       user_id:
     *         type: string
     *         format: uuid
     *         description: User's identifier that owns this task
     *         example: 7d3ba767-9ea6-4461-b1b1-79e845aef66e
     *       user:
     *         $ref: '#/definitions/User'
     *   User:
     *     type: object
     *     properties:
     *       id:
     *         type: string
     *         format: uuid
     *         description: User's identifier
     *         example: 0d58680f-7c8b-4de5-a80d-1e53cb1c60ce
     *       name:
     *         type: string
     *         description: User's name
     *         example: Michael Scott
     *       username:
     *         type: string
     *         description: User's login
     *         example: michael.scott
     *       email:
     *         type: string
     *         format: email
     *         description: User's email
     *         example: mscott@dundermifflin.com
     *       role:
     *         type: string
     *         enum: [Manager, Technician]
     *         description: User's role
     *         example: Manager
     *       created_at:
     *         type: string
     *         format: date
     *         description: User's creation date
     *         pattern: 'yyyy-MM-dd HH:mm:ss'
     *         example: 2020-03-04 10:20:30
     *   CreateTaskReq:
     *     type: object
     *     required:
     *       - summary
     *     properties:
     *       summary:
     *         type: string
     *         description: Task's summary
     *         minLength: 1
     *         maxLength: 2500
     *       user_id: 
     *         type: string
     *         format: uuid
     *         description: User that owns the task. In case it was not given, its assumed that the owner is the user that made the call. Only Managers can create tasks for different users.
     *         example: 0d58680f-7c8b-4de5-a80d-1e53cb1c60ce
     *   UpdateTaskReq:
     *     type: object
     *     required:
     *       - summary
     *       - status
     *     properties:
     *       summary:
     *         type: string
     *         description: Task's summary
     *         minLength: 1
     *         maxLength: 2500
     *       status:
     *         type: string
     *         enum: [Waiting, WIP, Done]
     *         description: Task's status
     *         example: WIP
     *   ErrorResp:
     *     type: object
     *     properties:
     *       error:
     *         type: string
     *         description: Error's description
     *         example: Error description
     */
})();