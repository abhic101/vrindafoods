const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const wireDependencies = require('./wireDependencies');

// Routes factories
const createAuthRoute = require('./features/auth/auth.routes');
const createAccountRoute = require('./features/account/account.routes');
const createProductRoute = require('./features/product/product.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Mounting global middlewares
app.use(cors());
app.use(express.json());
app.use(morgan(process.env.STAGE));
app.use(cookieParser());

// Wiring feature dependencies
const {authController, accountController, productController} = wireDependencies();

// Creating and Mounting routes
app.get('/', (req, res) => {
    res.send('Server is alive');
});
app.use('/auth', createAuthRoute(authController));
app.use('/account', createAccountRoute(accountController));
app.use('/product', createProductRoute(productController));
// more routes mounting here

// Global error handler mounting
app.use(errorHandler);

module.exports = app;