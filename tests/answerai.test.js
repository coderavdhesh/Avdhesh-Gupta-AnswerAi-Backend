const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

let token;
let userId;
let questionId;

beforeAll(async () => {
    // Register and login a user to get a token
    // const random_username = Math.random().toString(36);
    // await request(app)
    //     .post('/api/users/newUsers')
    //     .send({
    //         username: random_username ,
    //         email: `${random_username}_testing_mail@gmail.com`,
    //         password: 'password123'
    //     });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'teli.gangu@gmail.com',
            password: 'password123'
        });

    token = res.body.token;
    userId = res.body.userId;
});



describe('AnswerAi Endpoints', () => {

    
    it('should register a new user', async () => {
        const random_username = Math.random().toString(36)+' - testing data';
        const res = await request(app)
            .post('/api/users/newUser')
            .send({
                username: random_username,
                email: `${random_username}_testing_mail@gmail.com`,
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', `${random_username} registered successfully`);
    });

    it('should deny to register the existing user as a new user', async () => {
        const res = await request(app)
            .post('/api/users/newUser')
            .send({
                username: 'Gangu teli',
                email: 'teli.gangu@gmail.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should login a exixting user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teli.gangu@gmail.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Should fail to login with wrong credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'teli.gangu@gmail.com',
                password: 'wrongpassword'
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });


    // test cases for Users

    it('should retrieve user profile', async () => {

        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('username');

    });

    it('should deny to retrieve user profile with wrong token', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer wrong_invalid_token`);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error','Invalid token');
    });

    it('should fail to retrieve user profile without token', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.statusCode).toEqual(401);
        // expect(res.body).toHaveProperty('TypeError');
    });



    // test cases for questions

    it('should submit a new question', async () => {
        const res = await request(app)
            .post('/api/questions')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: userId,
                question: 'What is the capital of France?'
            });
        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('id');
        questionId = res.body.id;
    });

    it('should retrieve a specific question by ID', async () => {
        const res = await request(app)
            .get(`/api/questions/${questionId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(400);
        // expect(res.body).toHaveProperty('id', questionId);
    });

    it('should retrieve all questions asked by a user', async () => {
        const res = await request(app)
            .get(`/api/users/${userId}/questions`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(400);
        // expect(Array.isArray(res.body)).toBe(true);
    });

});


afterAll(async () => {
    await mongoose.connection.close();
});