const request = require('supertest');
const app = require('../../app');

describe('POST /account/password', () => {
    const endpoint = '/account/password';
    const agent = request.agent(app);

    beforeAll(async () => {
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'ValidPass!123'});
    });
    test('should return 200 when changing password with correct criteria', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                currentPassword: 'ValidPass!123',
                newPassword: 'StrongNewPassword1!'
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        await agent
            .post('/auth/login')
            .send({username: 'test_user123', password: 'StrongNewPassword1!'});
    });

    test('should return 422 Validation Error if new password misses special character', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                currentPassword: 'ValidPass!123',
                newPassword: 'NoSpecialChar123'
            });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
        expect(JSON.stringify(res.body.details)).toContain('Must contain at least one special character');
    });

    test('should return 400 Bad Request (or Unauthorized) logically if current password is wrong', async () => {
        const res = await agent
            .post(endpoint)
            .send({
                currentPassword: 'IncorrectOldPassword1!',
                newPassword: 'StrongNewPassword1!'
            });

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("Incorrect password");
    });

    afterAll(async () => {
        await agent.post(endpoint).send({
            currentPassword: 'StrongNewPassword1!',
            newPassword: 'ValidPass!123'
        });
    });
});