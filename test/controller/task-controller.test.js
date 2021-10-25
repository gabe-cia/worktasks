const supertest = require('supertest');
const app = require('../../src/app');

var managerToken;
var technicianToken;
var tasksToBeDeleted = [];

const JIM_USER_ID = "7d3ba767-9ea6-4461-b1b1-79e845aef66e";
const MICHAEL_USER_ID = "bc4369c4-437e-46c3-8e12-99dfa3d7b47f";
const DWIGHT_USER_ID = 'fb39304b-cdcc-43f6-8ae2-41bb1a5f69c2';
const JIM_TASK_ID = "29caeca9-0fde-4de9-9a32-f470ca3795ca";
const DWIGHT_TASK_ID = "648a03e1-8664-4c3a-88a6-ded58103c19c";

const LOCATION_URL_REGEX = /\/tasks\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

/*
 * Generating tokens before sendind requests
 */
beforeAll(async () => {
    managerToken = await _getToken("michael.scott", "michael.scott");
    technicianToken = await _getToken("jim.halpert", "jim.halpert");
    return true;
});

/*
 * GET /tasks tests 
 */
test('GET /tasks for Manager - 200', async () => {
    const response = await supertest(app)
        .get('/tasks')
        .set('Authorization', managerToken);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
});

test('GET /tasks for Technician - 200', async () => {
    const response = await supertest(app)
        .get('/tasks')
        .set('Authorization', technicianToken);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(_onlyContainsOwnTasks(response.body, 'jim.halpert')).toBeTruthy();
});

test('GET /tasks with invalid credentials - 401', async () => {
    const response = await supertest(app)
        .get('/tasks')
        .set('Authorization', 'not.valid.token');

    expect(response.statusCode).toEqual(401);
});

/*
 * GET /tasks/:id tests 
 */
test('GET /tasks/:id for Manager - 200', async () => {
    const response = await supertest(app)
        .get('/tasks/' + JIM_TASK_ID)
        .set('Authorization', managerToken);

    expect(response.statusCode).toEqual(200);
    expect(response.body.id).toBe(JIM_TASK_ID);
});

test('GET /tasks/:id for Technician - 200', async () => {
    const response = await supertest(app)
        .get('/tasks/' + JIM_TASK_ID)
        .set('Authorization', technicianToken);

    expect(response.statusCode).toEqual(200);
    expect(response.body.id).toBe(JIM_TASK_ID);
    expect(response.body.user.username).toBe("jim.halpert");
});

test('GET /tasks/:id with invalid identifier - 404', async () => {
    const response = await supertest(app)
        .get('/tasks/' + "invalidid")
        .set('Authorization', technicianToken);

    expect(response.statusCode).toEqual(404);
});

test('GET /tasks/:id with invalid credentials - 401', async () => {
    const response = await supertest(app)
        .get('/tasks/' + JIM_TASK_ID)
        .set('Authorization', "not.valid.token");

    expect(response.statusCode).toEqual(401);
});

test('GET /tasks/:id for wrong Technician - 403', async () => {
    const response = await supertest(app)
        .get('/tasks/' + DWIGHT_TASK_ID)
        .set('Authorization', technicianToken);

    expect(response.statusCode).toEqual(403);
});

/*
 * POST /tasks tests 
 */
test('POST /tasks for Manager creating task for himself with implicit identifier - 201', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', managerToken)
        .send({
            summary: 'New Task - Test'
        });

    tasksToBeDeleted.push(response.headers.location.substring(7));

    expect(response.statusCode).toEqual(201);
    expect(response.headers.location).toMatch(LOCATION_URL_REGEX);
});

test('POST /tasks for Manager creating task for himself with explicit identifier  - 201', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', managerToken)
        .send({
            summary: 'New Task - Test',
            user_id: MICHAEL_USER_ID
        });

    tasksToBeDeleted.push(response.headers.location.substring(7)); 

    expect(response.statusCode).toEqual(201);
    expect(response.headers.location).toMatch(LOCATION_URL_REGEX);
});

test('POST /tasks for Manager creating task for others - 201', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', managerToken)
        .send({
            summary: 'New Task - Test',
            user_id: JIM_USER_ID
        });

    tasksToBeDeleted.push(response.headers.location.substring(7)); 

    expect(response.statusCode).toEqual(201);
    expect(response.headers.location).toMatch(LOCATION_URL_REGEX);
});

test('POST /tasks for Technician creating task for himself with implicit identifier - 201', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', technicianToken)
        .send({
            summary: 'New Task - Test'
        });
    
    tasksToBeDeleted.push(response.headers.location.substring(7)); 

    expect(response.statusCode).toEqual(201);
    expect(response.headers.location).toMatch(LOCATION_URL_REGEX);
});

test('POST /tasks for Technician creating task for himself with explicit identifier - 201', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', technicianToken)
        .send({
            summary: 'New Task - Test',
            user_id: JIM_USER_ID
        });

    tasksToBeDeleted.push(response.headers.location.substring(7)); 

    expect(response.statusCode).toEqual(201);
    expect(response.headers.location).toMatch(LOCATION_URL_REGEX);
});

test('POST /tasks for Technician creating task for others - 403', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', technicianToken)
        .send({
            summary: 'New Task - Test',
            user_id: DWIGHT_USER_ID
        });

    expect(response.statusCode).toEqual(403);
});

test('POST /tasks with no body - 400', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', managerToken)
        .send({
        });

    expect(response.statusCode).toEqual(400);
});

test('POST /tasks with invalid user identifier - 404', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', managerToken)
        .send({
            summary: 'New Task - Test',
            user_id: 'invalid_user_id'
        });

    expect(response.statusCode).toEqual(404);
});

test('POST /tasks with invalid credentials - 401', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', 'not.valid.token')
        .send({
            summary: 'New Task - Test'
        });

    expect(response.statusCode).toEqual(401);
});

/*
 * PUT /tasks/:id tests 
 */
test('PUT /tasks/:id for Manager updating task for others - 204', async () => {
    const response = await supertest(app)
        .put('/tasks/' + JIM_TASK_ID)
        .set('Authorization', managerToken)
        .send({
            summary: 'Updated Task - Test',
            status: 'WIP'
        });

    expect(response.statusCode).toEqual(204);
});

test('PUT /tasks/:id for Technician updating task for himself - 204', async () => {
    const response = await supertest(app)
        .put('/tasks/' + JIM_TASK_ID)
        .set('Authorization', technicianToken)
        .send({
            summary: 'Updated Task - Test',
            status: 'WIP'
        });

    expect(response.statusCode).toEqual(204);
});

test('PUT /tasks/:id for Technician updating task for others - 403', async () => {
    const response = await supertest(app)
        .put('/tasks/' + DWIGHT_TASK_ID)
        .set('Authorization', technicianToken)
        .send({
            summary: 'Updated Task - Test',
            status: 'WIP'
        });

    expect(response.statusCode).toEqual(403);
});

test('PUT /tasks/:id with no body - 400', async () => {
    const response = await supertest(app)
        .put('/tasks/' + JIM_TASK_ID)
        .set('Authorization', managerToken)
        .send({
        });

    expect(response.statusCode).toEqual(400);
});

test('PUT /tasks/:id with without status - 400', async () => {
    const response = await supertest(app)
        .put('/tasks/' + JIM_TASK_ID)
        .set('Authorization', managerToken)
        .send({
            summary: 'Updated Task - Test'
        });

    expect(response.statusCode).toEqual(400);
});

test('PUT /tasks/:id with without summary - 400', async () => {
    const response = await supertest(app)
        .put('/tasks/' + JIM_TASK_ID)
        .set('Authorization', managerToken)
        .send({
            status: 'WIP'
        });

    expect(response.statusCode).toEqual(400);
});

test('PUT /tasks/:id with invalid task identifier - 404', async () => {
    const response = await supertest(app)
        .put('/tasks/' + 'invalid_task_id')
        .set('Authorization', managerToken)
        .send({
            summary: 'Updated Task - Test',
            status: 'WIP'
        });

    expect(response.statusCode).toEqual(404);
});

test('PUT /tasks/:id with invalid credentials - 401', async () => {
    const response = await supertest(app)
        .put('/tasks/' + JIM_TASK_ID)
        .set('Authorization', 'not.valid.token')
        .send({
            summary: 'Updated Task - Test',
            status: 'WIP'
        });

    expect(response.statusCode).toEqual(401);
});

/*
 * DELETE /tasks/:id tests 
 */
test('DELETE /tasks/:id for Manager - 204', async () => {
    const response = await supertest(app)
        .delete('/tasks/' + tasksToBeDeleted.pop())
        .set('Authorization', managerToken);

    expect(response.statusCode).toEqual(204);
});

test('DELETE /tasks/:id for Technician - 403', async () => {
    const response = await supertest(app)
        .delete('/tasks/' + tasksToBeDeleted[0])
        .set('Authorization', technicianToken);

    expect(response.statusCode).toEqual(403);
});

test('DELETE /tasks/:id with invalid task identifier - 404', async () => {
    const response = await supertest(app)
        .delete('/tasks/' + 'invalid_identifier')
        .set('Authorization', managerToken);

    expect(response.statusCode).toEqual(404);
});

test('DELETE /tasks/:id with invalid credentials - 401', async () => {
    const response = await supertest(app)
        .delete('/tasks/' + tasksToBeDeleted[0])
        .set('Authorization', 'not.valid.token');

    expect(response.statusCode).toEqual(401);
});

/**
 * Removing the created tasks after all the tests
 */
afterAll(async () => {
    while(tasksToBeDeleted.length > 0) {
        await _deleteTask(tasksToBeDeleted.pop());
    }
    return false;
});

function _onlyContainsOwnTasks(tasks, username) {
    return tasks.every((task) => task.user.username === username);
}

async function _getToken(username, password) {
    const response = await supertest(app)
        .post('/users/login')
        .send({ username, password });
    return response.body.authorization_token;
}

async function _deleteTask(task_id) {
    return await supertest(app)
        .delete('/tasks/' + task_id)
        .set('Authorization', managerToken);
}
