const request = require('supertest');
const app = require('../../app'); // Adjust this to point to your Express app

describe('POST /auth/login', () => {
    // Seeded user data
    const validWithUsername = {
        username: 'test_user123',
        password: 'ValidPass!123'
    };

    const validWithEmail = {
        email: 'testuser@example.com',
        password: 'ValidPass!123'
    };

    // --- SUCCESS CASES ---

    test('should successfully login with email and return auth cookie', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send(validWithEmail);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Login successfull',
            success: true
        });

        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
        expect(cookies.some(cookie => cookie.startsWith('auth='))).toBe(true);
    });

    test('should successfully login with username and return auth cookie', async () => {
        // Assuming your backend supports finding the seeded user by username as well
        const response = await request(app)
            .post('/auth/login')
            .send(validWithUsername);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    // --- ZOD SCHEMA VALIDATION CASES ---

    test('should fail validation if neither username nor email is provided (refine test)', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ password: 'SecureP@ss1' });

        expect(response.status).toBe(422); // Or whatever status your validationErrorHandler uses
        expect(response.body.success).toBe(false);
        // Checking for your custom refine message
        expect(JSON.stringify(response.body.details)).toContain('Please provide either username or email');
    });

    test('should fail validation if extraneous fields are sent (strict test)', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ 
                ...validWithEmail, 
                role: 'admin', // Extraneous field 
                age: 25 
            });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('details');
    });

    test('should fail validation if password is under 8 characters', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'newemail@example.com', password: 'short' });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(JSON.stringify(response.body.details)).toContain('Password must be atleast 8 characters long');
    });

    test('should fail validation if username is under 3 characters', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ username: 'vi', password: 'SecureP@ss1' });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(JSON.stringify(response.body.details)).toContain('Username must be atleast 3 characters long');
    });

    test('should fail validation if email format is invalid', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: 'invalid-email-format', password: 'SecureP@ss1' });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('details'); 
    });

    // --- STANDARD FALLBACK ERROR CASES ---

    test('should return standard error fallback for incorrect password', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({ email: validWithEmail.email, password: 'WrongPassword123' });

        expect(response.status).toBe(401); 
        expect(response.body).toEqual(expect.objectContaining({
            success: false,
            message: expect.any(String)
        }));
        expect(response.body.details).toBeUndefined(); // Ensures we hit the fallback, not the validation handler
    });
});