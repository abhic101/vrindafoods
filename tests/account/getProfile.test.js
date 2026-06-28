const request = require('supertest');
const app = require('../../app');

describe('GET /account/profile', () => {
    const endpoint = '/account/profile';
    const agent = request.agent(app);

    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'ValidPass!123'});
    });

    test('should return 200 and the user profile when authenticated with correct scope', async () => {
        const res = await agent.get(endpoint);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.profile).toBeDefined();
    });

    test('should return 401 Unauthorized when no token is provided', async () => {
        const res = await request(app).get(endpoint);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });
});