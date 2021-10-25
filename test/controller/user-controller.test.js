const supertest = require('supertest');
const app = require('../../src/app');
const jwt = require("jsonwebtoken");

/*
 * POST /users/login tests 
 */
test('POST /users/login for Manager - 200', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            username: "michael.scott",
            password: "michael.scott"
        });
 
    expect(response.statusCode).toEqual(200);
    expect(response.body.authorization_token).toBeDefined();
    expect(_isTokenValid(response.body.authorization_token)).toBeTruthy()
});

test('POST /users/login for Technician - 200', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            username: "jim.halpert",
            password: "jim.halpert"
        });
 
    expect(response.statusCode).toEqual(200);
    expect(response.body.authorization_token).toBeDefined();
    expect(_isTokenValid(response.body.authorization_token)).toBeTruthy()
});

test('POST /users/login with no body - 400', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
        });
 
    expect(response.statusCode).toEqual(400);
});

test('POST /users/login with no body - 400', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            username: "jim.halpert",
        });
 
    expect(response.statusCode).toEqual(400);
});

test('POST /users/login with no body - 400', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            password: "jim.halpert",
        });
 
    expect(response.statusCode).toEqual(400);
});

test('POST /users/login for Technician - 404', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            username: "creed.braton",
            password: "creed.braton"
        });
 
    expect(response.statusCode).toEqual(404);
});

test('POST /users/login for Technician - 401', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            username: "jim.halpert",
            password: "wrong.password"
        });
 
    expect(response.statusCode).toEqual(401);
});

function _isTokenValid(token) {
    try {
        let decoded = jwt.verify(token, process.env.TOKEN_KEY);
    } catch(ex) {
        return false;
    }
    return true;
}