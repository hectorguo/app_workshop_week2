'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarSchema = new Schema({
    license: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        default: ''
    },
    make: {
        type: String,
        default: ''
    },
    doorCount: Number,
    driver: {
        type: String,
        unique: true,
        ref: 'Driver'
    }
});

module.exports = mongoose.model('Car', CarSchema);
