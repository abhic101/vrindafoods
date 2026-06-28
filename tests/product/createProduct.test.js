const request = require('supertest');
const app = require('../../app'); // Adjust path to your Express app

describe('POST /product', () => {
    const endpoint = '/product';
    const agent = request.agent(app);

    // Create a valid base payload to avoid repeating it
    const validProductPayload = {
        name: 'Wireless Headphones',
        mrp: 150,
        selling_price: 120,
        thumbnail: 'https://example.com/image.png',
        units: 50,
        amount: 1,
        amount_unit: 'piece',
        brand: 'AudioTech',
        category: 'Electronics'
    };

    beforeAll(async () => {
        // Authenticate agent. The 'auth' cookie is automatically stored by the agent.
        await agent
            .post('/auth/login')
            .send({ username: 'creator_user', password: 'ValidPass!123' });
    });

    test('should return 200 and create product when valid payload is provided', async () => {
        const res = await agent
            .post(endpoint)
            .send(validProductPayload);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.newProduct).toBeDefined();
    });

    test('should return 422 Validation Error when MRP is negative', async () => {
        const res = await agent
            .post(endpoint)
            .send({ ...validProductPayload, mrp: -10 });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
        expect(res.body.details).toBeDefined();
    });

    test('should return 422 Validation Error when thumbnail URL is invalid', async () => {
        const res = await agent
            .post(endpoint)
            .send({ ...validProductPayload, thumbnail: 'not-a-valid-url' });

        expect(res.status).toBe(422);
        expect(res.body.success).toBe(false);
    });

    test('should return 401 Unauthorized when no cookie is provided', async () => {
        // Bypass the agent to test stateless/unauthenticated request
        const res = await request(app)
            .post(endpoint)
            .send(validProductPayload);

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test('should return 409 Conflict logically if a product with the same unique identifier (e.g., SKU/Name) already exists', async () => {
        // Assuming your DB enforces unique names per seller
        await agent.post(endpoint).send(validProductPayload); // First insert
        const res = await agent.post(endpoint).send(validProductPayload); // Duplicate insert

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
    });
});