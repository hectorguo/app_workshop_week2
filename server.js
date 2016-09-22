// server.js

// BASIC SETUP
// =============================================================================
'use strict';
// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var open = require('open');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to APP Workshop Week 2!' });
});

// more routes for our API will happen here

// We will simulate a database output, for a real app you should use an ORM an create a data model to work through the different CRUD operations
var cars = [{
    "car_id": 'c_11',
    "model": "S Hatch",
    "made": "ford",
    "door_number": 4,
    "color": "blue",
    "plate_number": "SV2123"
}, {
    "car_id": 'c_12',
    "model": "Model S",
    "made": "Tesla",
    "door_number": 4,
    "color": "white",
    "plate_number": "SN3333"
}, {
    "car_id": 'c_13',
    "model": "Model X",
    "made": "Tesla",
    "door_number": 4,
    "color": "black",
    "plate_number": "SN3334"
}];

var drivers = [{
    "driver_id": "d_1",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@xx.com",
    "phone_number": "6503333333",
    "car_id": "c_11"
}, {
    "driver_id": "d_2",
    "first_name": "Huber",
    "last_name": "Smith",
    "email": "huber@xx.com",
    "phone_number": "6503334444",
    "car_id": "c_12"
}];

var passengers = [{
    "passenger_id": "p_1",
    "first_name": "John",
    "last_name": "Smith",
    "email": "john@xx.com",
    "phone_number": "6503333333"
},{
    "passenger_id": "p_2",
    "first_name": "Hector",
    "last_name": "Guo",
    "email": "hectorguo@me.com",
    "phone_number": "6503333333"
}];

function reportError(statusCode, msg, req, res) {
    const statusMsg = {
        200: 'OK',
        201: 'Created',
        204: 'No Content',
        400: 'Bad Request',
        404: 'Not Found'
    };
    res
        .status(statusCode)
        .json({
            status: statusCode,
            error: statusMsg[statusCode],
            msg,
            timestamp: Date.now(),
            path: req.originalUrl
        })
        .end();
}

function uniqueId() {
    return `${Date.now()}${Math.random() * 10 | 0}`; // timestamp + 1 digit random
}

function throwIfMissing(param) {
    throw new Error(`${param} required`);
}

var handleDriver = {
    get(id) {
        if (!id) {
            throwIfMissing('id');
        }
        const curDriver = drivers.filter(item => item.driver_id === id)[0];
        if(!curDriver) {
            throw new Error(`Driver: ${id} not found`);
        }
        return curDriver;
    },
    create(info) {
        if (!info) {
            throwIfMissing('driver info');
        }
        if (!info.first_name) {
            throwIfMissing('first_name');
        }
        if (!info.last_name) {
            throwIfMissing('last_name');
        }
        const defaultInfo = { email: '', phone_number: '' };
        const newDriver = Object.assign(defaultInfo, info, { driver_id: `d_${uniqueId()}` });
        drivers.push(newDriver);
        return newDriver;
    },
    update(id, info) {
        if (!info) {
            throwIfMissing('driver update info');
        }
        const curDriver = handleDriver.get(id);
        Object.assign(curDriver, info, { driver_id: id, car_id: curDriver.car_id });
        return curDriver;
    },
    del(id) {
        for (let i = drivers.length - 1; i >= 0; i--) {
            if (drivers[i].driver_id === id) {
                drivers.splice(i, 1);
                return {
                    msg: `driver: ${id} has been removed`
                };
            }
        }
        throw new Error(`Driver: ${id} not found`);
    },
    getCar(driverId) {
        const curDriver = handleDriver.get(driverId);
        const curCar = handleCar.get(curDriver.car_id);

        return curCar;
    },
    createCar(driverId, carInfo) {
        if (!driverId) {
            throw new Error('Driver id required');
        }

        const curDriver = handleDriver.get(driverId);
        const newCar = handleCar.create(carInfo);
        curDriver.car_id = newCar.car_id;
        return newCar;
    },
    updateCar(driverId, carInfo) {
        const curCar = handleDriver.getCar(driverId);
        Object.assign(curCar, carInfo, {car_id: curCar.car_id}); // car_id should not be replaced
        return curCar;
    },
    delCar(driverId) {
        const curDriver = handleDriver.get(driverId);
        return handleCar.del(curDriver.car_id);
    }
};

var handleCar = {
    get(id) {
        if (!id) {
            throwIfMissing('id');
        }
        const curCar = cars.filter(item => item.car_id === id)[0];

        if(!curCar) {
            throw new Error(`Car: ${id} not found`);
        }
        return curCar;
    },
    create(info) {
        if(!info) {
            throwIfMissing('car info');
        }
        if (!info.plate_number) {
            throwIfMissing('plate_number');
        }
        const defaultInfo = {
            model: '',
            made: '',
            door_number: 4,
            color: ''
        };
        const carId = `c_${uniqueId()}`;
        const newCar = Object.assign(defaultInfo, info, { car_id: carId });
        cars.push(newCar);
        return newCar;
    },
    update(id, info) {
        if (!info) {
            throwIfMissing('update info');
        }
        const carInfo = handleCar.get(id);
        Object.assign(carInfo, info, { car_id: carInfo.car_id });
        return carInfo;
    },
    del(id) {
        for (let i = cars.length - 1; i >= 0; i--) {
            if (cars[i].car_id === id) {
                cars.splice(i, 1);
                return {
                    msg: `car: ${id} has been removed`
                };
            }
        }
        throw new Error(`Car: ${id} not found`);
    }
};

var handlePassenger = {
    get(id) {
        if (!id) {
            throwIfMissing('id');
        }
        const curPassenger = passengers.filter(item => item.passenger_id === id)[0];

        if(!curPassenger) {
            throw new Error(`passenger: ${id} not found`);
        }
        return curPassenger;
    },
    create(info) {
        if (!info) {
            throwIfMissing('passenger info');
        }
        if (!info.first_name) {
            throwIfMissing('first_name');
        }
        if (!info.last_name) {
            throwIfMissing('last_name');
        }
        const defaultInfo = { email: '', phone_number: '' };
        const newPassenger = Object.assign(defaultInfo, info, { passenger_id: `p_${uniqueId()}` });
        passengers.push(newPassenger);
        return newPassenger;
    },
    update(id, info) {
        if (!info) {
            throwIfMissing('passenger update info');
        }
        const curPassenger = handlePassenger.get(id);
        Object.assign(curPassenger, info, { passenger_id: id});
        return curPassenger;
    },
    del(id) {
        for (let i = passengers.length - 1; i >= 0; i--) {
            if (passengers[i].passenger_id === id) {
                passengers.splice(i, 1);
                return {
                    msg: `passenger: ${id} has been removed`
                };
            }
        }
        throw new Error(`Passenger: ${id} not found`);
    }
}

router.route('/driver')
    .get((req, res) => {
        res.status(200).json(drivers);
    })
    .post((req, res) => {
        try {
            const newDriver = handleDriver.create(req.body);
            res.status(201).json(newDriver);
        } catch (e) {
            reportError(400, e.message, req, res);
        }
    });

router.route('/driver/:id')
    .get((req, res) => {
        try {
            const curDriver = handleDriver.get(req.params.id);
            res.status(200).json(curDriver);
        } catch (e) {
            reportError(404, e.message, req, res);
        }
    })
    .patch((req, res) => {
        try {
            const curDriver = handleDriver.update(req.params.id, req.body);
            res.sendStatus(204);
        } catch (e) {
            reportError(400, e.message, req, res);
        }
    })
    .delete((req, res) => {
        try {
            const removedDriver = handleDriver.del(req.params.id);
            res.status(200).json(removedDriver);
        } catch (e) {
            reportError(400, e.message, req, res);
        }
    });

router.route('/driver/:id/car')
    .get((req, res) => {
        try {
            const curCar = handleDriver.getCar(req.params.id);
            res.status(200).json(curCar);
        } catch(e) {
            reportError(404, e.message, req, res);
        }
    })
    .post((req, res) => {
        try {
            const newCar = handleDriver.createCar(req.params.id, req.body);
            res.status(201).json(newCar);
        } catch(e) {
            reportError(400, e.message, req, res);
        }
    })
    .patch((req, res) => {
        try {
            const updatedCar = handleDriver.updateCar(req.params.id, req.body);
            res.sendStatus(204);
        } catch(e) {
            reportError(400, e.message, req, res);
        }
    })
    .delete((req, res) => {
        try {
            const removedCar = handleDriver.delCar(req.params.id);
            res.status(200).json(removedCar);
        } catch(e) {
            reportError(400, e.message, req, res);
        }
    });

router.route('/passenger')
    .get((req, res) => {
        res.status(200).json(passengers);
    })
    .post((req, res) => {
        try {
            const newPassenger = handlePassenger.create(req.body);
            res.status(201).json(newPassenger);
        } catch (e) {
            reportError(400, e.message, req, res);
        }
    });

router.route('/passenger/:id')
    .get((req, res) => {
        try {
            const curPassenger = handlePassenger.get(req.params.id);
            res.status(200).json(curPassenger);
        } catch (e) {
            reportError(404, e.message, req, res);
        }
    })
    .patch((req, res) => {
        try {
            const curPassenger = handlePassenger.update(req.params.id, req.body);
            res.sendStatus(204);
        } catch (e) {
            reportError(400, e.message, req, res);
        }
    })
    .delete((req, res) => {
        try {
            const removedPassenger = handlePassenger.del(req.params.id);
            res.status(200).json(removedPassenger);
        } catch (e) {
            reportError(400, e.message, req, res);
        }
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.use('/test', express.static('test/browser'));

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Service running on port ' + port);

open('http://localhost:8080/test');

module.exports = app;
