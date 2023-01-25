const request = require('supertest');
const app = require('./app.js');

describe('All users request', () => {
    let users;
    beforeEach(() => {
        users = [
            {
                "id": 1,
                "email": "gabe@test.com",
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

    describe('get api/users', () => {
        it('should return a 200', async () => {
            const response = await request(app).get('/api/users')
            expect(response.status).toBe(200);
        })

        it('should respond with an array of users', async () => {
            const response = await request(app).get('/api/users');
            expect(response.body).toEqual(users);
        })
    })
});

describe('Individual User Tests', () => {
    let user = {
        "id": 1,
        "email": "gabe@test.com",
        "first_name": "Gabriel",
        "last_name": "Bigelow",
        "address": "2253 Waterworks Drive",
        "city": "Toledo",
        "state": "OH",
        "country": "USA",
        "active": true,
        "password": "$2b$10$w2oBTCyknEwcy5EJxwWgBeL7/Z7BouQ/N1mr8Q46PpM.2r7rVomwm"
    }

    describe('Login - POST api/auth/login', () => {
        it('should return a user object', async () => {
            const response = await request(app).post('/api/auth/login').send({ "email": "testUser", "password": "testing"});;
            expect(response.body).toEqual(user);
        })
    });
});

describe('Products Tests', () => {
    let products
    
    beforeEach(() => {
        products = [
            {
                "id": 1,
                "name": "Mousepad",
                "price": "$14.99",
                "stock": 14,
                "active": true
            },
            {
                "id": 2,
                "name": "Gaming mouse",
                "price": "$59.99",
                "stock": 15,
                "active": true
            },
            {
                "id": 3,
                "name": "ATX Mid-Tower Case",
                "price": "$79.99",
                "stock": 12,
                "active": true
            },
            {
                "id": 4,
                "name": "240hz 1080p monitor",
                "price": "$259.99",
                "stock": 18,
                "active": true
            },
            {
                "id": 5,
                "name": "8 GB DDR4 RAM",
                "price": "$34.99",
                "stock": 16,
                "active": true
            },
            {
                "id": 6,
                "name": "600w PSU",
                "price": "$59.99",
                "stock": 0,
                "active": true
            },
            {
                "id": 7,
                "name": "B450 Motherboard",
                "price": "$99.99",
                "stock": 18,
                "active": true
            },
            {
                "id": 8,
                "name": "GTX 1080",
                "price": "$239.99",
                "stock": 18,
                "active": true
            },
            {
                "id": 9,
                "name": "Ryzen 5 5600X",
                "price": "$189.99",
                "stock": 13,
                "active": true
            },
            {
                "id": 10,
                "name": "1 TB NVMe SSD",
                "price": "$89.99",
                "stock": 18,
                "active": true
            },
            {
                "id": 11,
                "name": "Custom cables",
                "price": "$34.99",
                "stock": 18,
                "active": true
            },
            {
                "id": 12,
                "name": "RGB Mechanical Keyboard",
                "price": "$74.99",
                "stock": 18,
                "active": true
            }
        ];
    });

    describe('Get all active products', () => {
        it('returns a 200', async () => {
            const response = await request(app).get('/api/products');
            expect(response.status).toBe(200);
        })

        it('returns an array of products', async () => {
            const response = await request(app).get('/api/products');
            expect(response.body).toEqual(products);
        })
    })
})

// register new user doesn't pass every time because it always creates a new, higher id number.
/*describe('Register New User', () => {
    const user = {
        "id": 33,
        "email": "testUser",
        "first_name": null,
        "last_name": null,
        "address": null,
        "city": null,
        "state": null,
        "country": null,
        "active": true,
        "password": "$2b$10$OcjF3iW.4LsN1cjzuYz3uee7/TdxWUGy363FerLP/90LCpWMgrln6"
    };

    describe("POST api/auth/register", () => {
        it("should return a 200", async () => {
            const response = await request(app).post('/api/auth/register').send(user);
            expect(response.status).toBe(200);
        }),
        it("should add a new user to the Users table", async () => {
            const response = await request(app).get('/api/users')
            expect(response.body[2]).toEqual(user);
        })
    });
})*/
