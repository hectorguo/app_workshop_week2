'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RideSchema = new Schema({
    passenger: {
        type: String,
        refer: 'Passenger',
        required: true
    },
    driver: {
        type: String,
        refer: 'Driver',
        required: true
    },
    car: {
        type: String,
        refer: 'Car',
        required: true
    },
    rideType: {
        type: String,
        required: true,
        validate: [{
            validator: function (val) {
                return val === 'ECONOMY' || val === 'PREMIUM' || val === 'EXECUTIVE';
            },
            msg: 'invaild ride type, you can only choose ECONOMY / PREMIUM / EXECUTIVE',
            type: 'notvalid'
        }]
    },
    startPoint: [Number], // [<longitude>, <latitude>]
    endPoint: [Number], // [<longitude>, <latitude>]
    requestTime: Number,
    pickupTime: Number,
    dropOffTime: Number,
    status: {
        type: String,
        validate: [{
            validator: function (val) {
                const validVal = ['REQUESTED', 'AWAITING_DRIVER', 'DRIVE_ASSIGNED', 'IN_PROGRESS', 'ARRIVED', 'CLOSED'];
                return validVal.indexOf(val) >= 0;
            },
            msg: 'invaild ride status, you can only choose REQUESTED, AWAITING_DRIVER, DRIVE_ASSIGNED, IN_PROGRESS, ARRIVED, CLOSED',
            type: 'notvalid'
        }]
    },
    fare: Number,
    route: []
});

module.exports = mongoose.model('Ride', RideSchema);
