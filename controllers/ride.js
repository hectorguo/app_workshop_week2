'use strict';

const express = require('express');
const router = express.Router();

const Ride = require('../models/ride');
const utils = require('../utils');
const ModelHandle = require('./factory');


const rideHandle = new ModelHandle(Ride, 'Ride');


router.route('/rides')
    /**
     * GET call for the ride entity (multiple).
     * @returns {object} A list of rides. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get((req, res) => {
        rideHandle.get()
            .then((rides) => {
                res.status(200).json(rides);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * POST call for the ride entity.
     * @param {string} license - The license plate of the new ride
     * @returns {object} A message and the ride created. (201 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .post((req, res) => {
        rideHandle.create(req.body)
            .then((response) => {
                res.status(201).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    });

/** 
 * Express Route: /rides/:ride_id
 * @param {string} ride_id - Id Hash of ride Object
 */
router.route('/rides/:ride_id')
    /**
     * GET call for the ride entity (single).
     * @returns {object} the ride with Id ride_id. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .get(function (req, res) {
        rideHandle.get(req.params.ride_id)
            .then((ride) => {
                res.status(200).json(ride);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * PATCH call for the ride entity (single).
     * @returns {object} A message and the ride updated. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .patch(function (req, res) {
        rideHandle.update(req.params.ride_id, req.body)
            .then((response) => {
                res.status(200).json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            });
    })
    /**
     * DELETE call for the ride entity (single).
     * @returns {object} A string message. (200 Status Code)
     * @throws Mongoose Database Error (500 Status Code)
     */
    .delete(function (req, res) {
        rideHandle.del(req.params.ride_id)
            .then((response) => {
                res.json(response);
            })
            .catch((err) => {
                utils.handleMongooError(err, res);
            })
    });

module.exports = router;