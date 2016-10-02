'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaySchema = new Schema({
    accountType: {
        type: String,
        required: true,
        maxlength: 18
    },
    accountNumber: {
        type: Number,
        required: true,
        unique: true,
        maxlength: 18
    },
    expirationDate: {
        type: Number
    },
    nameOnAccount: {
        type: String,
        maxlength: 18,
        required: true    
    },
    bank: {
        type: Number,
        required: true,
        refer: 'Driver'
    },
    driver_id: String,
    passenger_id: String
});

module.exports = mongoose.model('Pay', PaySchema);
