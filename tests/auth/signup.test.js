const request = require('supertest');
const app = require('../../app'); // Adjust this to point to your Express app

describe('POST /auth/signup', () => {
    // Valid baseline payload
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

    // --- SUCCESS CASES ---

    test('should successfully sign up a new user with all fields', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send(validSignupPayload);

        // Assuming your controller returns a 201 Created for a new resource
        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            success: true,
            message: expect.any(String)
        }));
    });

    test('should successfully sign up a new user without optional fields', async () => {
        const payloadWithoutOptional = { ...validSignupPayload };
        delete payloadWithoutOptional.phone;
        delete payloadWithoutOptional.country_code;
        
        // Let's use a unique email/username for this second success test
        payloadWithoutOptional.email = 'another@example.com';
        payloadWithoutOptional.username = 'another_user';

        const response = await request(app)
            .post('/auth/signup')
            .send(payloadWithoutOptional);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });

    // --- ZOD SCHEMA VALIDATION CASES ---

    test('should fail validation if required fields are missing', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ 
                email: 'test@example.com',
                password: 'ValidPass!123' 
                // Missing username, firstname, lastname, dob
            });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('details');
    });

    test('should fail validation if username contains invalid characters', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ 
                ...validSignupPayload, 
                username: 'invalid user!' // spaces and exclamation marks are not in the regex
            });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(JSON.stringify(response.body.details)).toContain('Username can only contain letters, numbers, underscores, and hyphens');
    });

    test('should fail validation if password lacks a special character', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ 
                ...validSignupPayload, 
                password: 'NoSpecialChar123' 
            });

        expect(response.status).toBe(422);
        expect(JSON.stringify(response.body.details)).toContain('Must contain at least one special character');
    });

    test('should fail validation if password lacks an uppercase letter', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ 
                ...validSignupPayload, 
                password: 'lowercase!123' 
            });

        expect(response.status).toBe(422);
        expect(JSON.stringify(response.body.details)).toContain('Password must contain at least one uppercase letter');
    });

    test('should fail validation if dob is not a valid date', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({ 
                ...validSignupPayload, 
                dob: 'not-a-date' // Zod coercion will fail on this
            });

        expect(response.status).toBe(422);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty('details');
    });

    // --- STANDARD FALLBACK ERROR CASES ---

    test('should return standard error if user already exists', async () => {
        // First, create the user
        await request(app).post('/auth/signup').send(validSignupPayload);

        // Attempt to create the same user again
        const response = await request(app)
            .post('/auth/signup')
            .send(validSignupPayload);

        // Assuming your controller throws a 409 Conflict for duplicate entries
        expect(response.status).toBe(409); 
        expect(response.body).toEqual(expect.objectContaining({
            success: false,
            message: expect.any(String)
        }));
        
        // Ensure it went through standard error handling, not Zod validation
        // Checks that the array contains both of these exact elements
        expect(response.body.details).toEqual(
        expect.arrayContaining([
            expect.objectContaining({field: 'email', message: "email is already in use" }),
        ]));
    });
});