// server.js

// BASIC SETUP
// =============================================================================
'use strict';
// call the packages we need
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const open = require('open');

const mongoose    = require('mongoose');

const port = process.env.PORT || 8080;        // set our port
const MONGO_URL = 'mongodb://hector:guo@ds041566.mlab.com:41566/hectorguo';

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

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to APP Workshop Week 2!' });
});

app.use('/api', car);
app.use('/api', driver);
app.use('/api', passenger);
app.use('/api', paymentAccount);
app.use('/api', ride);

app.use('/test', express.static('test/browser'));

// invalid resource
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
