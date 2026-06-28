const request = require('supertest');
const app = require('../../app');

describe('POST /account/username', () => {
    const endpoint = '/account/username';
    const agent = request.agent(app);

    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'ValidPass!123'});
    });

    test('should return 200 when valid username and password are provided', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newUsername: 'newcoolname'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('should return 422 Validation Error when newUsername is too short', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newUsername: 'ab' // Needs at least 3
            });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
    });

    test('should return 409 Conflict logically if username is already taken', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newUsername: 'another_user' // Assume seeded in DB
            });

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });

    test('should return 401 logically if the confirmation password is wrong', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'WrongPassword!',
                newUsername: 'validname'
            });

        expect(res.status).toBe(401); 
        expect(res.body.success).toBe(false);
    });

    test('should return 200 when valid username and password are provided', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                password: 'ValidPass!123',
                newUsername: 'test_user123'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });
});