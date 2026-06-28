const request = require('supertest');
const app = require('../../app');

describe('DELETE /account/', () => {
    const endpoint = '/account/';
    const agent = request.agent(app);

    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'ValidPass!123'});
    })

    test('should return 200 when account is successfully deleted', async () => {
        const res = await agent
            .delete(endpoint).send({password: 'ValidPass!123'});

        // Depending on your API design, this might be 204 No Content or 200 OK
        expect(res.status).toBe(200); 
        expect(res.body.success).toBe(true);
    });

    test('should return 401 Unauthorized if trying to delete without a token', async () => {
        const res = await request(app)
            .delete(endpoint).send({password: 'ValidPass!123'});;

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    afterAll(async () => {
        const validSignupPayload = {
            email: 'testuser@example.com',
            username: 'test_user123',
            password: 'ValidPass!123',
            firstname: 'John',
            lastname: 'Doe',
            dob: '1995-05-15', // Zod will coerce this valid date string
            phone: '1234567890',
            country_code: '+1'
        };
        await request(app)
            .post('/auth/signup')
            .send(validSignupPayload);
    })
});