// server.js

// BASIC SETUP
// =============================================================================
'use strict';
// call the packages we need
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const open = require('open');

const mongoose = require('mongoose');
const conf = require('./config');
const port = process.env.PORT || 8080;        // set our port
const MONGO_URL = conf.database;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(MONGO_URL);

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router();              // get an instance of the express Router

const utils = require('./utils');

const car = require('./controllers/car');
const driver = require('./controllers/driver');
const passenger = require('./controllers/passenger');
const paymentAccount = require('./controllers/paymentAccount');
const ride = require('./controllers/ride');
const session = require('./controllers/session');

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to APP Workshop Week 2!' });
});

// setup and sessions router do not need to verify token
app.use('/api', session);

// Authentication
app.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) { 
        utils.reportError(403, 1011, 'No token provided', res);
        return;
    }

    utils.verifyUser(token)
        .then(() => {
            next();
        })
        .catch((err) => {
            utils.reportError(403, 1011, 'Failed to authenticate token', res);
        });
});

app.use('/api', car);
app.use('/api', driver);
app.use('/api', passenger);
app.use('/api', paymentAccount);
app.use('/api', ride);

app.use('/test', express.static('test/browser'));

// handle 404 resource
app.use((req, res, next) => {
    utils.reportError(404, 1001, 'resource not found', res);
    next();
});

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Service running on port ' + port);

// open('http://localhost:8080/test');

module.exports = app;
