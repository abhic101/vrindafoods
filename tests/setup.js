require('dotenv').config({ path: './config/.env.test', override: true });
console.log(__dirname);
const mongoose = require('mongoose');

async function connect() {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME
    });

    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
    mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));
}

async function disconnect() {
    await mongoose.disconnect();
}

beforeAll(async () => await connect());
afterAll(async () => await disconnect());