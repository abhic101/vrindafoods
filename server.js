require('dotenv').config({path: './config/.env'});

const app = require('./app');
const db = require('./config/db.config');

const PORT = process.env.PORT || 3000;

// For graceful exit on error signal
async function shutdown(signal, server) {
    console.log(`${signal} received, shutting down...`);

    server.close(async () => {
        await db.disconnect();
        console.log('Shutdown complete');
        process.exit(0);
    });

    // Force exit in case the process does not exit in 10 sec
    setTimeout(() => {
        console.error('Forced shoutdown after timeout');
        process.exit(1);
    }, 10_000);
}

// Initiate server
async function start() {

    // Connecting database
    try {
        await db.connect();
        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database not connected', err.message);
        process.exit(1);
    }

    // Binding port and creating server
    const server = app.listen(PORT, () => {
        console.log(`Server started at http://localhost:${PORT}`);
    });

    // Binding shutdown functionality for error signals from system
    process.on('SIGTERM', () => shutdown('SIGTERM', server));
    process.on('SIGINT', () => shutdown('SIGNINT', server));
    
    // Binding shutdown or error signals from app
    process.on('uncaughtException', (err) => {
        console.error('Uncaught exception: ', err);
        shutdown('uncaughtException', server);
    });

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled rejection: ', err)
        shutdown('unhandledRejection', server);
    });
}

start();