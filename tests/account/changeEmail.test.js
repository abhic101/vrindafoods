const request = require('supertest');
const app = require('../../app');

describe('POST /account/email', () => {
    const endpoint = '/account/email';
    const agent = request.agent(app);

    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'ValidPass!123'});
    });

    test('should return 200 when requesting email change with valid payload', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newEmail: 'newemail@example.com'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('should return 422 Validation Error when email is invalid format', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newEmail: 'not-an-email'
            });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
        expect(JSON.stringify(res.body.details)).toMatch(/email/i);
    });

    test('should return 409 Conflict logically if email already exists in system', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newEmail: 'another@example.com' // Assume seeded
            });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    test('should return 200 when requesting email change with valid payload', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newEmail: 'testuser@example.com'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

});