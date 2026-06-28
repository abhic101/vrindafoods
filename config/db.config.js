const mongoose = require('mongoose');

async function connect() {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
        maxPoolSize: 5,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000
    });
    console.log(process.env.DB_NAME);

    mongoose.connection.on('disconnected', () => console.warn("MongoDB disconnected"));
    mongoose.connection.on('error', (err) => console.error('MongoDB error: ', err));
}

async function disconnect() {
    await mongoose.disconnect();
}

module.exports = {connect, disconnect};