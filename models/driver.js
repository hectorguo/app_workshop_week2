'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseHidden = require('mongoose-hidden')();

const utils = require('../utils');

const DriverSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: String,
    password: {
        type: String,
        hide: true,
        required: true
    },
    email: {
        type: String,
        validate: [{
            validator: utils.validateEmail,
            msg: 'invaild email address',
            type: 'notvalid'
        }, {
            validator: function(val) {
                return typeof val === 'string';
            },
            msg: 'TypeError: need to be a string'
        }]
    },
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: String,
    phoneNumber: Number
});

DriverSchema.plugin(mongooseHidden);

module.exports = mongoose.model('Driver', DriverSchema);