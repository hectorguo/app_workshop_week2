'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaySchema = new Schema({
    accountType: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    expirationDate: {
        type: Number,
        refer: 'Passenger'
    },
    nameOnAccount: String,
    bank: {
        type: Number,
        refer: 'Driver'
    }
});

module.exports = mongoose.model('Pay', PaySchema);
