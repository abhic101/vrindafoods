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

    mongoose.connection.on('disconnected', () => console.warn("MongoDB disconnected"));
    mongoose.connection.on('errro', (err) => console.error('MongoDB error: ', err));
}

async function disconnect() {
    await mongoose.disconnect();
}

module.exports = {connect, disconnect};