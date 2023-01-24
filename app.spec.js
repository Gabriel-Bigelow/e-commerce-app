/*const request = require('supertest');
const baseURL = "http://localhost:4000";
const app = require('./app.js');

describe('api', () => {
    let users;
    beforeEach(() => {
        users = [
            {
                "id": 1,
                "email": "gabriel@gabrielbigelow.com",
                "first_name": "Gabriel",
                "last_name": "Bigelow",
                "address": "2253 Waterworks Drive",
                "city": "Toledo",
                "state": "OH",
                "country": "USA",
                "active": true,
                "password": "111"
            },
            {
                "id": 2,
                "email": "abby@abbypauch.com",
                "first_name": "Abby",
                "last_name": "Pauch",
                "address": "1224 Mapleway Drive",
                "city": "Temperance",
                "state": "MI",
                "country": "USA",
                "active": true,
                "password": "222"
            }
        ]
        app.locals.users = users;
    })

    describe('get api/carts', () => {
        it('should return a 200', async () => {
            const response = await request(app).get('/api/users')
            expect(response.status).toBe(200);
        })

        it('should respond with an array of users', async () => {
            const response = await request(app).get('/api/users');
            expect(response.body).toEqual(users);
        })
    })
})*/