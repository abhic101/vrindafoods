const request = require('supertest');
const app = require('../../app');

describe('PATCH /account/profile', () => {
    const endpoint = '/account/profile';
    const agent = request.agent(app);
    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'ValidPass!123'});
    });

    test('should return 200 and update profile when valid fields are provided', async () => {
        const res = await agent
            .patch(endpoint)
            .send({
                firstname: 'John',
                lastname: 'Doe',
                dob: '1990-01-01'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('should return 422 Validation Error when body is completely empty', async () => {
        const res = await agent
            .patch(endpoint)
            .send({});

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
        expect(res.body.details).toBeDefined();
    });

    test('should return 422 Validation Error when firstname exceeds 20 characters', async () => {
        const res = await agent
            .patch(endpoint)
            .send({
                firstname: 'ThisNameIsWayTooLongForTheDatabase'
            });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
        expect(res.body.details).toBeDefined();
    });

    test('should return 422 Validation Error for invalid date format', async () => {
        const res = await agent
            .patch(endpoint)
            .send({
                dob: 'not-a-valid-date'
            });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
    });
});